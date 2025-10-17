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
    address: {
      type: String,
      required: true
    },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    }
  },
  destination: {
    address: {
      type: String,
      required: true
    },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    }
  },
  vehicleType: {
    type: String,
    enum: ["moto", "car", "taxi", "bus"],
    required: true
  },
  status: {
    type: String,
    enum: ["requested", "accepted", "driver_assigned", "in_progress", "completed", "cancelled", "no_drivers", "expired"],
    default: "requested"
  },
  fare: {
    type: Number,
    required: true,
    min: 0
  },
  distance: {
    type: Number, // in kilometers
    required: true,
    min: 0
  },
  duration: {
    type: Number, // in minutes
    required: true,
    min: 0
  },
  paymentMethod: {
    type: String,
    enum: ["cash", "mobile_money", "card", "paypal", "pesapal"],
    default: "cash"
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed", "refunded"],
    default: "pending"
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  feedback: String,
  
  // Safety and incident reporting
  incidentReport: {
    type: String,
    enum: ["none", "accident", "unsafe_driving", "harassment", "vehicle_issue", "route_deviation", "payment_issue", "other"],
    default: "none"
  },
  incidentDescription: String,
  sosAlert: {
    type: Boolean,
    default: false
  },
  sosDescription: String,
  
  // Timestamps for different stages
  requestedAt: {
    type: Date,
    default: Date.now
  },
  acceptedAt: Date,
  pickedUpAt: Date,
  completedAt: Date,
  cancelledAt: Date,
  
  // Additional data
  estimatedArrival: Date,
  actualRoute: [{
    lat: Number,
    lng: Number,
    timestamp: Date
  }],
  driverLocationUpdates: [{
    lat: Number,
    lng: Number,
    timestamp: { type: Date, default: Date.now }
  }],
  
  // USSD ride specific fields
  isUssdRide: {
    type: Boolean,
    default: false
  },
  ussdCode: String, // For USSD ride tracking
  
  // Cancellation details
  cancelledBy: {
    type: String,
    enum: ["passenger", "driver", "system"]
  },
  cancellationReason: String,
  
  // Additional metadata
  notes: String,
  surgeMultiplier: {
    type: Number,
    default: 1.0,
    min: 1.0
  }
}, { 
  timestamps: true 
});

// Indexes for better performance
rideSchema.index({ passenger: 1, createdAt: -1 });
rideSchema.index({ driver: 1, createdAt: -1 });
rideSchema.index({ status: 1 });
rideSchema.index({ createdAt: -1 });
rideSchema.index({ "pickupLocation.coordinates": "2dsphere" });
rideSchema.index({ ussdCode: 1 });

// Virtual for ride duration in minutes
rideSchema.virtual('rideDuration').get(function() {
  if (this.pickedUpAt && this.completedAt) {
    return Math.round((this.completedAt - this.pickedUpAt) / 60000); // minutes
  }
  return null;
});

// Method to update ride status
rideSchema.methods.updateStatus = function(newStatus, additionalData = {}) {
  this.status = newStatus;
  
  // Set timestamps based on status
  const now = new Date();
  switch (newStatus) {
    case 'accepted':
      this.acceptedAt = now;
      break;
    case 'in_progress':
      this.pickedUpAt = now;
      break;
    case 'completed':
      this.completedAt = now;
      break;
    case 'cancelled':
      this.cancelledAt = now;
      this.cancelledBy = additionalData.cancelledBy;
      this.cancellationReason = additionalData.reason;
      break;
  }
  
  return this.save();
};

// Static method to find active rides for a user
rideSchema.statics.findActiveRides = function(userId, role) {
  const query = {};
  
  if (role === 'passenger') {
    query.passenger = userId;
  } else if (role === 'driver') {
    query.driver = userId;
  }
  
  query.status = { $in: ['requested', 'accepted', 'driver_assigned', 'in_progress'] };
  
  return this.findOne(query)
    .populate('passenger', 'name phone profilePhoto')
    .populate('driver', 'name phone profilePhoto driverInfo');
};

// Pre-save middleware to calculate fare based on distance and vehicle type
rideSchema.pre('save', function(next) {
  if (this.isModified('distance') || this.isModified('vehicleType') || this.isNew) {
    const baseFares = {
      moto: 3000,
      car: 7000,
      taxi: 8000,
      bus: 2000
    };
    
    const ratePerKm = {
      moto: 500,
      car: 600,
      taxi: 700,
      bus: 300
    };
    
    const baseFare = baseFares[this.vehicleType] || 5000;
    const distanceCharge = this.distance * (ratePerKm[this.vehicleType] || 500);
    
    this.fare = Math.round((baseFare + distanceCharge) * this.surgeMultiplier);
  }
  next();
});

module.exports = mongoose.model("Ride", rideSchema);