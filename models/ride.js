const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema({
  passenger: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  pickupLocation: {
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  destination: {
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  status: {
    type: String,
    enum: ["requested", "accepted", "in_progress", "completed", "cancelled"],
    default: "requested"
  },
  fare: {
    type: Number,
    default: 0
  },
  distance: {
    type: Number,
    default: 0
  },
  duration: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  feedback: String,
  incidentReport: {
    type: String,
    enum: ["none", "accident", "delay", "unsafe_driving", "complaint", "other"],
    default: "none"
  },
  incidentDescription: String,
  delayMinutes: {
    type: Number,
    default: 0
  },
  sosAlert: {
    type: Boolean,
    default: false
  },
  sosDescription: String,
  estimatedArrival: Date
}, { 
  timestamps: true 
});

module.exports = mongoose.model("Ride", rideSchema);