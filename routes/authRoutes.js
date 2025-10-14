const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");

// Signup route
router.post("/signup", async (req, res) => {
  try {
    console.log("Signup request body:", req.body);
    
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ 
        success: false, 
        message: "All fields are required." 
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ 
        success: false, 
        message: "Passwords do not match." 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: "Password must be at least 6 characters long." 
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: "Email already registered. Please login." 
      });
    }

    const newUser = new User({ 
      name, 
      email: email.toLowerCase(), 
      password,
      role: "passenger" 
    });
    
    await newUser.save();

    res.json({ 
      success: true, 
      message: "Registration successful! Please login with your credentials.", 
      redirectUrl: "/" 
    });

  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ 
      success: false, 
      message: "Server error. Please try again later." 
    });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    console.log("Login attempt:", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Please enter both email and password." 
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    console.log("Found user:", user ? `${user.name} (${user.role})` : "Not found");
    
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: "User not found. Please sign up first." 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch);
    
    if (!isMatch) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid email or password." 
      });
    }

    if (user.status !== "active") {
      return res.status(400).json({ 
        success: false, 
        message: "Your account is not active. Please contact administrator." 
      });
    }

    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    console.log("Login successful, user role:", user.role);

    let redirectUrl = "/";
    if (user.role === "admin") {
      redirectUrl = "/admin/dashboard";
    } else if (user.role === "driver") {
      redirectUrl = "/driver/dashboard";
    } else if (user.role === "passenger") {
      redirectUrl = "/passenger/dashboard";
    }

    res.json({ 
      success: true, 
      message: "Login successful!", 
      redirectUrl: redirectUrl,
      role: user.role 
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ 
      success: false, 
      message: "Server error. Please try again later." 
    });
  }
});

module.exports = router;