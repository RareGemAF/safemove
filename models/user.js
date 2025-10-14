const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ["passenger", "admin", "driver"],
    default: "passenger"
  },
  phone: {
    type: String,
    trim: true
  },
  nin: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ["active", "pending", "suspended"],
    default: "active"
  },
  driverInfo: {
    licenseNumber: String,
    vehicleType: String,
    vehiclePlate: String,
    rating: {
      type: Number,
      default: 0
    },
    totalRides: {
      type: Number,
      default: 0
    }
  }
}, { 
  timestamps: true 
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);