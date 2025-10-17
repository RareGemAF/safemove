const mongoose = require("mongoose");

const sosAlertSchema = new mongoose.Schema({
  passenger: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ride: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ride'
  },
  type: {
    type: String,
    enum: ["emergency", "medical", "accident", "harassment", "unsafe_driving", "vehicle_issue", "other"],
    required: true
  },
  location: {
    address: String,
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    }
  },
  description: String,
  mediaUrls: [{
    type: String, // URLs to audio/video recordings
    description: String
  }],
  urgency: {
    type: String,
    enum: ["low", "medium", "high", "critical"],
    default: "medium"
  },
  status: {
    type: String,
    enum: ["active", "responded", "resolved", "false_alarm"],
    default: "active"
  },
  
  // Response information
  respondedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Admin or support staff who responded
  },
  responseNotes: String,
  responseActions: [{
    action: String, // "called_passenger", "dispatched_help", "contacted_authorities"
    timestamp: Date,
    performedBy: mongoose.Schema.Types.ObjectId,
    notes: String
  }],
  
  // Emergency services dispatch
  emergencyServicesDispatched: {
    type: Boolean,
    default: false
  },
  servicesDispatched: [{
    service: String, // "police", "ambulance", "fire"
    dispatchTime: Date,
    estimatedArrival: Date,
    contactNumber: String
  }],
  
  // Resolution
  resolvedAt: Date,
  resolutionNotes: String,
  
  // Additional data
  additionalData: {
    batteryLevel: Number,
    networkType: String,
    appState: String,
    audioDuration: Number, // in seconds
    videoDuration: Number, // in seconds
    trustedContactsNotified: [{
      contactId: mongoose.Schema.Types.ObjectId,
      notifiedAt: Date,
      response: String
    }]
  }
}, { 
  timestamps: true 
});

// Indexes
sosAlertSchema.index({ passenger: 1, createdAt: -1 });
sosAlertSchema.index({ status: 1, urgency: -1 });
sosAlertSchema.index({ createdAt: -1 });
sosAlertSchema.index({ "location.coordinates": "2dsphere" });

// Method to update alert status
sosAlertSchema.methods.updateStatus = function(newStatus, responseData = {}) {
  this.status = newStatus;
  
  if (newStatus === 'resolved') {
    this.resolvedAt = new Date();
    this.resolutionNotes = responseData.notes;
  }
  
  if (responseData.respondedBy) {
    this.respondedBy = responseData.respondedBy;
  }
  
  return this.save();
};

// Method to log response action
sosAlertSchema.methods.logAction = function(actionData) {
  this.responseActions.push({
    action: actionData.action,
    timestamp: new Date(),
    performedBy: actionData.performedBy,
    notes: actionData.notes
  });
  
  return this.save();
};

// Static method to find active alerts
sosAlertSchema.statics.findActiveAlerts = function() {
  return this.find({ status: 'active' })
    .populate('passenger', 'name phone emergencyContacts')
    .populate('ride')
    .sort({ urgency: -1, createdAt: -1 });
};

module.exports = mongoose.model("SOSAlert", sosAlertSchema);