const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Ride = require("../models/ride");

const requirePassenger = (req, res, next) => {
  if (!req.session.user || req.session.user.role !== "passenger") {
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

  // Emit to all drivers for new ride requests
  if (eventType === 'ride-requested') {
    activeConnections.drivers.forEach((socketId, driverId) => {
      io.to(socketId).emit('new-ride-request', ride);
    });
  }

  // Emit to specific passenger if ride is updated
  if (ride.passenger && activeConnections.passengers.has(ride.passenger.toString())) {
    const passengerSocketId = activeConnections.passengers.get(ride.passenger.toString());
    io.to(passengerSocketId).emit('ride-status-update', {
      event: eventType,
      ride: ride
    });
  }

  // Emit to driver if assigned
  if (ride.driver && activeConnections.drivers.has(ride.driver.toString())) {
    const driverSocketId = activeConnections.drivers.get(ride.driver.toString());
    io.to(driverSocketId).emit('ride-status-update', {
      event: eventType,
      ride: ride
    });
  }
}

router.get("/dashboard", requirePassenger, async (req, res) => {
  try {
    const user = await User.findById(req.session.user.id);
    const activeRide = await Ride.findOne({
      passenger: req.session.user.id,
      status: { $in: ["requested", "accepted", "in_progress"] }
    }).populate("driver", "name phone vehicleType");

    const rideHistory = await Ride.find({
      passenger: req.session.user.id,
      status: "completed"
    })
    .populate("driver", "name")
    .sort({ createdAt: -1 })
    .limit(10);

    res.render("passenger", { 
      user: req.session.user,
      activeRide: activeRide,
      rideHistory: rideHistory
    });
  } catch (error) {
    res.status(500).render("passenger", { 
      user: req.session.user,
      error: "Failed to load dashboard"
    });
  }
});

router.post("/request-ride", requirePassenger, async (req, res) => {
  try {
    const { pickupLocation, destination } = req.body;

    if (!pickupLocation || !destination) {
      return res.json({ 
        success: false, 
        message: "Please provide both pickup location and destination." 
      });
    }

    const existingRide = await Ride.findOne({
      passenger: req.session.user.id,
      status: { $in: ["requested", "accepted", "in_progress"] }
    });

    if (existingRide) {
      return res.json({ 
        success: false, 
        message: "You already have an active ride. Please complete or cancel it first." 
      });
    }

    const baseFare = 5000;
    const distance = Math.random() * 20 + 2;
    const fare = Math.round(baseFare + (distance * 300));

    const newRide = new Ride({
      passenger: req.session.user.id,
      pickupLocation: { address: pickupLocation },
      destination: { address: destination },
      fare: fare,
      distance: parseFloat(distance.toFixed(2)),
      status: "requested"
    });

    await newRide.save();

    // Populate passenger info for real-time emission
    const populatedRide = await Ride.findById(newRide._id)
      .populate("passenger", "name email");

    // Emit real-time update to admin and drivers
    const io = req.app.get('io');
    const activeConnections = req.app.get('activeConnections');
    emitRideUpdate(io, activeConnections, populatedRide, 'ride-requested');

    res.json({ 
      success: true, 
      message: "Ride requested successfully! Looking for drivers...",
      ride: newRide
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Failed to request ride. Please try again." 
    });
  }
});

router.post("/submit-feedback", requirePassenger, async (req, res) => {
  try {
    const { rideId, rating, feedback } = req.body;

    if (!rideId || !rating) {
      return res.json({ 
        success: false, 
        message: "Please provide ride ID and rating." 
      });
    }

    const ride = await Ride.findOne({
      _id: rideId,
      passenger: req.session.user.id,
      status: "completed"
    });

    if (!ride) {
      return res.json({ 
        success: false, 
        message: "Ride not found or not completed." 
      });
    }

    ride.rating = parseInt(rating);
    ride.feedback = feedback;
    await ride.save();

    res.json({ 
      success: true, 
      message: "Feedback submitted successfully!" 
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Failed to submit feedback. Please try again." 
    });
  }
});

router.post("/report-incident", requirePassenger, async (req, res) => {
  try {
    const { rideId, incidentType, description } = req.body;

    if (!rideId || !incidentType) {
      return res.json({ 
        success: false, 
        message: "Please provide ride ID and incident type." 
      });
    }

    const ride = await Ride.findOne({
      _id: rideId,
      passenger: req.session.user.id
    });

    if (!ride) {
      return res.json({ 
        success: false, 
        message: "Ride not found." 
      });
    }

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

    res.json({ 
      success: true, 
      message: "Incident reported successfully! Our team will review it." 
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Failed to report incident. Please try again." 
    });
  }
});

router.post("/send-sos", requirePassenger, async (req, res) => {
  try {
    const { description } = req.body;

    const activeRide = await Ride.findOne({
      passenger: req.session.user.id,
      status: { $in: ["accepted", "in_progress"] }
    });

    if (!activeRide) {
      return res.json({ 
        success: false, 
        message: "No active ride found for SOS." 
      });
    }

    activeRide.sosAlert = true;
    activeRide.sosDescription = description;
    await activeRide.save();

    // Emit SOS alert to admin
    const io = req.app.get('io');
    const activeConnections = req.app.get('activeConnections');
    const populatedRide = await Ride.findById(activeRide._id)
      .populate("passenger", "name email")
      .populate("driver", "name email");
    
    emitRideUpdate(io, activeConnections, populatedRide, 'sos-alert');

    res.json({ 
      success: true, 
      message: "SOS alert sent! Help is on the way. We've notified authorities and our support team." 
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Failed to send SOS. Please try again or call emergency services." 
    });
  }
});

router.get("/ride-status", requirePassenger, async (req, res) => {
  try {
    const activeRide = await Ride.findOne({
      passenger: req.session.user.id,
      status: { $in: ["requested", "accepted", "in_progress"] }
    }).populate("driver", "name phone vehicleType");

    res.json({ 
      success: true, 
      ride: activeRide 
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Failed to get ride status." 
    });
  }
});

router.get("/ride-history", requirePassenger, async (req, res) => {
  try {
    const rides = await Ride.find({
      passenger: req.session.user.id,
      status: "completed"
    })
    .populate("driver", "name")
    .sort({ createdAt: -1 })
    .limit(10);

    res.json({ 
      success: true, 
      rides: rides 
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Failed to load ride history." 
    });
  }
});

router.post("/cancel-ride", requirePassenger, async (req, res) => {
  try {
    const { rideId } = req.body;

    const ride = await Ride.findOne({
      _id: rideId,
      passenger: req.session.user.id,
      status: { $in: ["requested", "accepted"] }
    });

    if (!ride) {
      return res.json({ 
        success: false, 
        message: "Ride not found or cannot be cancelled." 
      });
    }

    ride.status = "cancelled";
    await ride.save();

    // Emit cancellation to admin and driver
    const io = req.app.get('io');
    const activeConnections = req.app.get('activeConnections');
    const populatedRide = await Ride.findById(ride._id)
      .populate("passenger", "name email")
      .populate("driver", "name email");
    
    emitRideUpdate(io, activeConnections, populatedRide, 'ride-cancelled');

    res.json({ 
      success: true, 
      message: "Ride cancelled successfully." 
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Failed to cancel ride." 
    });
  }
});

module.exports = router;