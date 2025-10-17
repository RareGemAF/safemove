const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  role: {
    type: String,
    enum: ["passenger", "driver", "admin"],
    default: "passenger"
  },
  status: {
    type: String,
    enum: ["active", "pending", "suspended", "inactive"],
    default: "active"
  },
  
  // Passenger specific fields
  emergencyContacts: [{
    name: String,
    phone: String,
    relationship: String,
    isPrimary: { type: Boolean, default: false }
  }],
  faceVerified: {
    type: Boolean,
    default: false
  },
  verificationDate: Date,
  preferredLanguage: {
    type: String,
    enum: ["en", "lg", "sw", "tt", "ny"],
    default: "en"
  },
  
  // Driver specific fields
  driverInfo: {
    licenseNumber: {
      type: String,
      sparse: true
    },
    licenseVerified: {
      type: Boolean,
      default: false
    },
    vehicleType: {
      type: String,
      enum: ["moto", "car", "taxi", "bus", null],
      default: null
    },
    vehiclePlate: {
      type: String,
      sparse: true
    },
    vehicleVerified: {
      type: Boolean,
      default: false
    },
    vehicleColor: String,
    vehicleModel: String,
    online: {
      type: Boolean,
      default: false
    },
    currentLocation: {
      lat: Number,
      lng: Number,
      address: String,
      lastUpdated: Date
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    totalRatings: {
      type: Number,
      default: 0
    },
    totalRides: {
      type: Number,
      default: 0
    },
    earnings: {
      type: Number,
      default: 0
    },
    safetyScore: {
      type: Number,
      default: 80,
      min: 0,
      max: 100
    },
    documents: [{
      type: String, // 'license', 'insurance', 'registration'
      url: String,
      verified: { type: Boolean, default: false },
      uploadedAt: Date
    }]
  },
  
  // Common fields
  profilePhoto: String,
  emailVerified: {
    type: Boolean,
    default: false
  },
  phoneVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: Date,
  loginHistory: [{
    ip: String,
    userAgent: String,
    timestamp: { type: Date, default: Date.now }
  }]
}, { 
  timestamps: true 
});

// Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ role: 1, status: 1 });
userSchema.index({ "driverInfo.online": 1 });
userSchema.index({ "driverInfo.currentLocation": "2dsphere" });

// Password hashing middleware
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Update driver location method
userSchema.methods.updateLocation = function(lat, lng, address) {
  if (this.role === 'driver') {
    this.driverInfo.currentLocation = {
      lat: lat,
      lng: lng,
      address: address,
      lastUpdated: new Date()
    };
    return this.save();
  }
};

// Toggle online status method
userSchema.methods.toggleOnline = function(online) {
  if (this.role === 'driver') {
    this.driverInfo.online = online;
    return this.save();
  }
};

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return this.name;
});

// Transform output
userSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.password;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model("User", userSchema);