require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
const nodemailer = require("nodemailer");
const http = require('http');
const socketIo = require('socket.io');

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const passengerRoutes = require("./routes/passengerRoutes");
const driverRoutes = require("./routes/driverRoutes");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const PORT = 4000;

// Store active connections
const activeConnections = {
  admin: null,
  drivers: new Map(),
  passengers: new Map()
};

// Socket.io for real-time communication
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Admin connects
  socket.on('admin-connect', () => {
    activeConnections.admin = socket.id;
    console.log('Admin connected');
  });

  // Driver connects
  socket.on('driver-connect', (driverId) => {
    activeConnections.drivers.set(driverId, socket.id);
    console.log(`Driver ${driverId} connected`);
  });

  // Passenger connects
  socket.on('passenger-connect', (passengerId) => {
    activeConnections.passengers.set(passengerId, socket.id);
    console.log(`Passenger ${passengerId} connected`);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    if (activeConnections.admin === socket.id) {
      activeConnections.admin = null;
    }
    
    // Remove from drivers
    for (let [driverId, socketId] of activeConnections.drivers) {
      if (socketId === socket.id) {
        activeConnections.drivers.delete(driverId);
        break;
      }
    }
    
    // Remove from passengers
    for (let [passengerId, socketId] of activeConnections.passengers) {
      if (socketId === socket.id) {
        activeConnections.passengers.delete(passengerId);
        break;
      }
    }
    
    console.log('User disconnected:', socket.id);
  });
});

// Make io and activeConnections available to routes
app.set('io', io);
app.set('activeConnections', activeConnections);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Session middleware
app.use(session({
  secret: "your-secret-key-12345",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/safemove", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("✅ MongoDB Connected");
  createAdmin();
})
.catch(err => console.error("MongoDB connection error:", err));

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verify email configuration
transporter.verify(function(error, success) {
  if (error) {
    console.log('❌ Email configuration error:', error);
  } else {
    console.log('✅ Email server is ready to send messages');
  }
});

app.set('transporter', transporter);

// Admin creation function
async function createAdmin() {
  try {
    const User = require("./models/user");
    const adminEmail = "admin12@gmail.com";
    const existingAdmin = await User.findOne({ 
      email: adminEmail.toLowerCase(),
      role: "admin" 
    });

    if (!existingAdmin) {
      const adminUser = new User({
        name: "Admin User",
        email: adminEmail.toLowerCase(),
        password: "admin1234",
        role: "admin",
        status: "active"
      });
      
      await adminUser.save();
      console.log("✅ Default admin created: admin12@gmail.com / admin1234");
    } else {
      console.log("✅ Admin user already exists");
    }
  } catch (err) {
    console.error("❌ Error creating admin:", err);
  }
}

// Routes
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/passenger", passengerRoutes);
app.use("/driver", driverRoutes);

// Set view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Middleware to make user available to all templates
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Routes
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/admin", (req, res) => {
  if (!req.session.user || req.session.user.role !== "admin") {
    return res.redirect("/");
  }
  res.redirect("/admin/dashboard");
});

app.get("/driver", (req, res) => {
  if (!req.session.user || req.session.user.role !== "driver") {
    return res.redirect("/");
  }
  res.redirect("/driver/dashboard");
});

app.get("/passenger", (req, res) => {
  if (!req.session.user || req.session.user.role !== "passenger") {
    return res.redirect("/");
  }
  res.redirect("/passenger/dashboard");
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
    }
    res.redirect("/");
  });
});

// Test email endpoint
app.get("/test-email", async (req, res) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.send(`
        <div style="padding: 20px; font-family: Arial, sans-serif;">
          <h2 style="color: #ef4444;">❌ Email Configuration Missing</h2>
          <p>Please create a <strong>.env</strong> file in your project root with:</p>
          <pre style="background: #f3f4f6; padding: 10px; border-radius: 5px;">
EMAIL_USER=your-actual-email@gmail.com
EMAIL_PASS=your-16-character-app-password</pre>
        </div>
      `);
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: 'NovaMove - Email Configuration Test',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1e40af 0%, #3730a3 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">SafeMove</h1>
          </div>
          <div style="padding: 20px;">
            <h2 style="color: #1e40af;">✅ Email Test Successful!</h2>
            <p>Your SafeMove email configuration is working correctly.</p>
          </div>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    res.send(`
      <div style="padding: 20px; font-family: Arial, sans-serif; text-align: center;">
        <h2 style="color: #10b981;">✅ Email Test Successful!</h2>
        <p>Check your email inbox (<strong>${process.env.EMAIL_USER}</strong>) for the test message.</p>
      </div>
    `);
  } catch (error) {
    res.send(`
      <div style="padding: 20px; font-family: Arial, sans-serif;">
        <h2 style="color: #ef4444;">❌ Email Test Failed</h2>
        <p><strong>Error:</strong> ${error.message}</p>
      </div>
    `);
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).send(`
    <div style="padding: 20px; font-family: Arial, sans-serif; text-align: center;">
      <h1 style="color: #ef4444;">404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <a href="/" style="background: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px;">
        Go Home
      </a>
    </div>
  `);
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).send(`
    <div style="padding: 20px; font-family: Arial, sans-serif; text-align: center;">
      <h1 style="color: #ef4444;">500 - Server Error</h1>
      <p>Something went wrong on our end. Please try again later.</p>
      <a href="/" style="background: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px;">
        Go Home
      </a>
    </div>
  `);
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📧 Test email configuration: http://localhost:${PORT}/test-email`);
  console.log(`🏠 Home page: http://localhost:${PORT}/`);
  console.log(`👨‍💼 Admin login: http://localhost:${PORT}/ (admin12@gmail.com / admin1234)`);
});