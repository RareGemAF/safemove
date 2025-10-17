const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Ride = require("../models/ride");

const requireAdmin = (req, res, next) => {
  if (!req.session.user || req.session.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied" });
  }
  next();
};

router.get("/dashboard", requireAdmin, async (req, res) => {
  try {
    const stats = await getDashboardStats();
    res.render("admin", { 
      user: req.session.user,
      stats: stats
    });
  } catch (error) {
    res.status(500).render("admin", { 
      user: req.session.user,
      error: "Failed to load dashboard"
    });
  }
});

async function getDashboardStats() {
  try {
    const totalUsers = await User.countDocuments();
    const totalDrivers = await User.countDocuments({ role: "driver" });
    const totalPassengers = await User.countDocuments({ role: "passenger" });
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const activeRides = await Ride.countDocuments({ 
      status: { $in: ["accepted", "in_progress"] } 
    });
    
    const todayRides = await Ride.countDocuments({ 
      createdAt: { $gte: today },
      status: "completed"
    });
    
    const totalRevenueResult = await Ride.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, total: { $sum: "$fare" } } }
    ]);
    
    const incidents = await Ride.countDocuments({ 
      incidentReport: { $ne: "none" } 
    });

    const todayRevenueResult = await Ride.aggregate([
      { 
        $match: { 
          status: "completed",
          createdAt: { $gte: today }
        } 
      },
      { $group: { _id: null, total: { $sum: "$fare" } } }
    ]);

    const sosAlerts = await Ride.countDocuments({
      sosAlert: true
    });

    return {
      activeRides: activeRides || 0,
      totalUsers: totalUsers || 0,
      totalDrivers: totalDrivers || 0,
      totalPassengers: totalPassengers || 0,
      todayRides: todayRides || 0,
      revenue: todayRevenueResult[0]?.total || 0,
      totalRevenue: totalRevenueResult[0]?.total || 0,
      safetyAlerts: incidents + sosAlerts || 0
    };
  } catch (error) {
    return {
      activeRides: 0,
      totalUsers: 0,
      totalDrivers: 0,
      totalPassengers: 0,
      todayRides: 0,
      revenue: 0,
      totalRevenue: 0,
      safetyAlerts: 0
    };
  }
}

router.post("/add-driver", requireAdmin, async (req, res) => {
  try {
    const { driverName, driverEmail, driverPhone, ninNumber } = req.body;
    
    if (!driverName || !driverEmail || !driverPhone || !ninNumber) {
      return res.json({ 
        success: false, 
        message: "All fields are required." 
      });
    }

    const existingUser = await User.findOne({ email: driverEmail.toLowerCase() });
    if (existingUser) {
      return res.json({ 
        success: false, 
        message: "User with this email already exists." 
      });
    }
    
    const randomNumber = Math.floor(100 + Math.random() * 9000);
    const driverPassword = `safemove@${randomNumber}`;
    
    const newDriver = new User({
      name: driverName,
      email: driverEmail.toLowerCase(),
      password: driverPassword,
      phone: driverPhone,
      nin: ninNumber,
      role: "driver",
      status: "active"
    });
    
    await newDriver.save();
    
    try {
      const transporter = req.app.get('transporter');
      const mailOptions = {
        from: process.env.EMAIL_USER || 'novamove2025@gmail.com',
        to: driverEmail,
        subject: 'Welcome to NovaMove - Driver Account Created',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #1e40af 0%, #3730a3 100%); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">NovaMove</h1>
            </div>
            <div style="padding: 20px;">
              <h2 style="color: #1e40af;">Welcome to NovaMove, ${driverName}!</h2>
              <p>Your driver account has been created successfully and is ready to use.</p>
              
              <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #1e293b; margin-top: 0;">Your Login Credentials:</h3>
                <p><strong>Email:</strong> ${driverEmail}</p>
                <p><strong>Password:</strong> ${driverPassword}</p>
              </div>
              
              <p><strong>Login URL:</strong> <a href="http://localhost:3000/">http://localhost:3000/</a></p>
              
              <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="color: #92400e; margin: 0;">
                  <strong>Important:</strong> For security reasons, please change your password after first login.
                </p>
              </div>
              
              <p>Once logged in, you can:</p>
              <ul>
                <li>View available ride requests</li>
                <li>Accept or decline rides</li>
                <li>Track your earnings</li>
                <li>Report incidents</li>
                <li>View your trip history</li>
              </ul>
              
              <p>If you have any questions or need assistance, please contact our support team.</p>
              
              <p>Best regards,<br><strong>The NovaMove Team</strong></p>
            </div>
            <div style="background: #f1f5f9; padding: 15px; text-align: center; color: #64748b;">
              <p style="margin: 0;">© 2024 NovaMove. All rights reserved.</p>
            </div>
          </div>
        `
      };
      
      await transporter.sendMail(mailOptions);
      
      res.json({ 
        success: true, 
        message: `Driver added successfully! Login credentials have been sent to ${driverEmail}.` 
      });
      
    } catch (emailError) {
      res.json({ 
        success: true, 
        message: `Driver added but email failed. Login: ${driverEmail}, Password: ${driverPassword}. Please provide these credentials manually.` 
      });
    }
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Failed to add driver. Please try again." 
    });
  }
});

router.delete("/users/:id", requireAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    
    if (userId === req.session.user.id) {
      return res.status(400).json({ 
        success: false, 
        message: "Cannot delete your own account." 
      });
    }

    const user = await User.findByIdAndDelete(userId);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found." 
      });
    }

    res.json({ 
      success: true, 
      message: "User deleted successfully." 
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Failed to delete user." 
    });
  }
});

router.delete("/rides/:id", requireAdmin, async (req, res) => {
  try {
    const rideId = req.params.id;

    const ride = await Ride.findByIdAndDelete(rideId);
    
    if (!ride) {
      return res.status(404).json({ 
        success: false, 
        message: "Ride not found." 
      });
    }

    res.json({ 
      success: true, 
      message: "Ride deleted successfully." 
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Failed to delete ride." 
    });
  }
});

router.get("/api/stats", requireAdmin, async (req, res) => {
  try {
    const stats = await getDashboardStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

router.get("/api/drivers", requireAdmin, async (req, res) => {
  try {
    const drivers = await User.find({ role: "driver" })
      .select("name email phone nin status createdAt")
      .sort({ createdAt: -1 });
    
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch drivers" });
  }
});

router.get("/api/users", requireAdmin, async (req, res) => {
  try {
    const users = await User.find()
      .select("name email phone role status createdAt")
      .sort({ createdAt: -1 });
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

router.get("/api/rides", requireAdmin, async (req, res) => {
  try {
    const rides = await Ride.find()
      .populate("passenger", "name email")
      .populate("driver", "name email")
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.json(rides);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch rides" });
  }
});

router.get("/api/incidents", requireAdmin, async (req, res) => {
  try {
    const incidents = await Ride.find({
      incidentReport: { $ne: "none" }
    })
    .populate("passenger", "name email")
    .populate("driver", "name email")
    .sort({ createdAt: -1 });
    
    res.json(incidents);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch incidents" });
  }
});

router.get("/api/analytics", requireAdmin, async (req, res) => {
  try {
    const revenueData = await getRevenueData();
    const rideData = await getRideAnalytics();
    const driverData = await getDriverStats();
    const feedbackData = await getFeedbackStats();
    
    res.json({
      revenue: revenueData,
      rides: rideData,
      drivers: driverData,
      feedback: feedbackData
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});

async function getRevenueData() {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const revenueData = await Ride.aggregate([
      { 
        $match: { 
          status: "completed",
          createdAt: { $gte: sevenDaysAgo }
        } 
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$fare" },
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
      
      const existing = revenueData.find(item => item._id === dateStr);
      filledData.push({
        date: dateStr,
        revenue: existing ? existing.revenue : 0,
        rides: existing ? existing.rides : 0
      });
    }

    return filledData;
  } catch (error) {
    return [];
  }
}

async function getRideAnalytics() {
  try {
    const rideData = await Ride.aggregate([
      { $match: { status: "completed" } },
      {
        $group: {
          _id: { $hour: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const filledData = [];
    for (let hour = 0; hour < 24; hour++) {
      const existing = rideData.find(item => item._id === hour);
      filledData.push({
        hour: hour,
        count: existing ? existing.count : 0
      });
    }

    return filledData;
  } catch (error) {
    return [];
  }
}

async function getDriverStats() {
  try {
    const driverData = await User.aggregate([
      { $match: { role: "driver" } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    return driverData;
  } catch (error) {
    return [];
  }
}

async function getFeedbackStats() {
  try {
    const feedbackData = await Ride.aggregate([
      { $match: { rating: { $exists: true, $ne: null } } },
      {
        $group: {
          _id: "$rating",
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const filledData = [];
    for (let rating = 1; rating <= 5; rating++) {
      const existing = feedbackData.find(item => item._id === rating);
      filledData.push({
        rating: rating,
        count: existing ? existing.count : 0
      });
    }

    return filledData;
  } catch (error) {
    return [];
  }
}

module.exports = router;