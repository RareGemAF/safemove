const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Ride = require("../models/ride");

const requireDriver = (req, res, next) => {
  if (!req.session.user || req.session.user.role !== "driver") {
    return res.status(403).json({ error: "Access denied" });
  }
  next();
};

// Helper function to emit real-time updates
function emitRideUpdate(io, activeConnections, ride, eventType) {
  // Emit to admin
  if (activeConnections.admin) {
    io.to(activeConnections.admin).emit('ride-update', {
      event: eventType,
      ride: ride
    });
  }

  // Emit to passenger
  if (ride.passenger && activeConnections.passengers.has(ride.passenger.toString())) {
    const passengerSocketId = activeConnections.passengers.get(ride.passenger.toString());
    io.to(passengerSocketId).emit('ride-status-update', {
      event: eventType,
      ride: ride
    });
  }

  // Emit to driver
  if (ride.driver && activeConnections.drivers.has(ride.driver.toString())) {
    const driverSocketId = activeConnections.drivers.get(ride.driver.toString());
    io.to(driverSocketId).emit('ride-status-update', {
      event: eventType,
      ride: ride
    });
  }
}

router.get("/dashboard", requireDriver, async (req, res) => {
  try {
    const driver = await User.findById(req.session.user.id);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayRides = await Ride.countDocuments({
      driver: req.session.user.id,
      status: "completed",
      createdAt: { $gte: today }
    });
    
    const pendingRequests = await Ride.countDocuments({
      status: "requested"
    });
    
    const todayEarningsResult = await Ride.aggregate([
      {
        $match: {
          driver: req.session.user.id,
          status: "completed",
          createdAt: { $gte: today }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$fare" }
        }
      }
    ]);
    
    const totalRides = await Ride.countDocuments({
      driver: req.session.user.id,
      status: "completed"
    });
    
    const rideRequests = await Ride.find({
      status: "requested"
    })
    .populate("passenger", "name phone")
    .sort({ createdAt: -1 })
    .limit(10);
    
    const tripHistory = await Ride.find({
      driver: req.session.user.id,
      status: "completed"
    })
    .populate("passenger", "name")
    .sort({ createdAt: -1 })
    .limit(10);
    
    const ratingResult = await Ride.aggregate([
      {
        $match: {
          driver: req.session.user.id,
          rating: { $exists: true, $ne: null }
        }
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalRatings: { $sum: 1 }
        }
      }
    ]);
    
    const stats = {
      todayEarnings: todayEarningsResult[0]?.total || 0,
      todayRides: todayRides || 0,
      pendingRequests: pendingRequests || 0,
      totalRides: totalRides || 0,
      rating: ratingResult[0]?.averageRating ? ratingResult[0].averageRating.toFixed(1) : "Not rated",
      totalRatings: ratingResult[0]?.totalRatings || 0
    };

    res.render("driver", { 
      user: req.session.user,
      stats: stats,
      rideRequests: rideRequests,
      tripHistory: tripHistory
    });
    
  } catch (error) {
    res.status(500).render("driver", { 
      user: req.session.user,
      error: "Failed to load dashboard"
    });
  }
});

router.post("/accept-ride/:rideId", requireDriver, async (req, res) => {
  try {
    const rideId = req.params.rideId;
    
    const existingActiveRide = await Ride.findOne({
      driver: req.session.user.id,
      status: { $in: ["accepted", "in_progress"] }
    });

    if (existingActiveRide) {
      return res.json({ 
        success: false, 
        message: "You already have an active ride. Complete it first before accepting a new one." 
      });
    }
    
    const ride = await Ride.findById(rideId);
    
    if (!ride) {
      return res.json({ 
        success: false, 
        message: "Ride not found." 
      });
    }
    
    if (ride.status !== "requested") {
      return res.json({ 
        success: false, 
        message: "Ride is no longer available." 
      });
    }
    
    ride.driver = req.session.user.id;
    ride.status = "accepted";
    await ride.save();

    // Populate ride info for real-time emission
    const populatedRide = await Ride.findById(ride._id)
      .populate("passenger", "name email")
      .populate("driver", "name email");

    // Emit real-time update to admin and passenger
    const io = req.app.get('io');
    const activeConnections = req.app.get('activeConnections');
    emitRideUpdate(io, activeConnections, populatedRide, 'ride-accepted');

    // Remove this ride from other drivers' requests
    activeConnections.drivers.forEach((socketId, driverId) => {
      if (driverId !== req.session.user.id) {
        io.to(socketId).emit('ride-accepted-by-other', rideId);
      }
    });
    
    res.json({ 
      success: true, 
      message: "Ride accepted successfully!",
      ride: ride
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Failed to accept ride. Please try again." 
    });
  }
});

router.post("/decline-ride/:rideId", requireDriver, async (req, res) => {
  try {
    const rideId = req.params.rideId;
    
    const ride = await Ride.findById(rideId);
    
    if (!ride) {
      return res.json({ 
        success: false, 
        message: "Ride not found." 
      });
    }
    
    res.json({ 
      success: true, 
      message: "Ride declined."
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Failed to decline ride. Please try again." 
    });
  }
});

router.post("/start-ride/:rideId", requireDriver, async (req, res) => {
  try {
    const rideId = req.params.rideId;
    
    const ride = await Ride.findOne({
      _id: rideId,
      driver: req.session.user.id,
      status: "accepted"
    });
    
    if (!ride) {
      return res.json({ 
        success: false, 
        message: "Ride not found or not assigned to you." 
      });
    }
    
    ride.status = "in_progress";
    await ride.save();

    // Emit real-time update
    const io = req.app.get('io');
    const activeConnections = req.app.get('activeConnections');
    const populatedRide = await Ride.findById(ride._id)
      .populate("passenger", "name email")
      .populate("driver", "name email");
    
    emitRideUpdate(io, activeConnections, populatedRide, 'ride-started');
    
    res.json({ 
      success: true, 
      message: "Ride started!",
      ride: ride
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Failed to start ride. Please try again." 
    });
  }
});

router.post("/complete-ride/:rideId", requireDriver, async (req, res) => {
  try {
    const rideId = req.params.rideId;
    
    const ride = await Ride.findOne({
      _id: rideId,
      driver: req.session.user.id,
      status: "in_progress"
    });
    
    if (!ride) {
      return res.json({ 
        success: false, 
        message: "Ride not found or not in progress." 
      });
    }
    
    ride.status = "completed";
    await ride.save();
    
    await User.findByIdAndUpdate(req.session.user.id, {
      $inc: { "driverInfo.totalRides": 1 }
    });

    // Emit real-time update
    const io = req.app.get('io');
    const activeConnections = req.app.get('activeConnections');
    const populatedRide = await Ride.findById(ride._id)
      .populate("passenger", "name email")
      .populate("driver", "name email");
    
    emitRideUpdate(io, activeConnections, populatedRide, 'ride-completed');
    
    res.json({ 
      success: true, 
      message: "Ride completed successfully!",
      ride: ride
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Failed to complete ride. Please try again." 
    });
  }
});

router.post("/report-incident", requireDriver, async (req, res) => {
  try {
    const { rideId, incidentType, description, location } = req.body;
    
    if (!incidentType || !description) {
      return res.json({ 
        success: false, 
        message: "Please provide incident type and description." 
      });
    }
    
    let ride = null;
    if (rideId) {
      ride = await Ride.findOne({
        _id: rideId,
        driver: req.session.user.id
      });
    }
    
    if (ride) {
      ride.incidentReport = incidentType;
      ride.incidentDescription = description;
      await ride.save();

      // Emit incident report to admin
      const io = req.app.get('io');
      const activeConnections = req.app.get('activeConnections');
      const populatedRide = await Ride.findById(ride._id)
        .populate("passenger", "name email")
        .populate("driver", "name email");
      
      emitRideUpdate(io, activeConnections, populatedRide, 'incident-reported');
    }
    
    res.json({ 
      success: true, 
      message: "Incident reported successfully! Our team will review it shortly." 
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Failed to report incident. Please try again." 
    });
  }
});

router.get("/api/stats", requireDriver, async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const earningsData = await Ride.aggregate([
      {
        $match: {
          driver: req.session.user.id,
          status: "completed",
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          earnings: { $sum: "$fare" },
          rides: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    const filledData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const existing = earningsData.find(item => item._id === dateStr);
      filledData.push({
        date: dateStr,
        earnings: existing ? existing.earnings : 0,
        rides: existing ? existing.rides : 0
      });
    }
    
    res.json({
      earnings: filledData,
      success: true
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: "Failed to load stats" 
    });
  }
});

module.exports = router;