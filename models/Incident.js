const mongoose = require("mongoose");

const incidentSchema = new mongoose.Schema({
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ride: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ride'
  },
  reportedAgainst: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Driver or passenger being reported
  },
  type: {
    type: String,
    enum: [
      "unsafe_driving", 
      "harassment", 
      "vehicle_issue", 
      "route_deviation", 
      "payment_issue", 
      "accident", 
      "theft",
      "verbal_abuse",
      "discrimination",
      "other"
    ],
    required: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true
  },
  mediaUrls: [{
    type: String,
    mediaType: {
      type: String,
      enum: ["image", "audio", "video", "document"]
    },
    description: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  location: {
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  severity: {
    type: String,
    enum: ["low", "medium", "high", "critical"],
    default: "medium"
  },
  status: {
    type: String,
    enum: ["reported", "under_review", "resolved", "dismissed", "escalated"],
    default: "reported"
  },
  
  // Assignment and tracking
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Admin assigned to handle this incident
  },
  assignedAt: Date,
  priority: {
    type: String,
    enum: ["low", "normal", "high", "urgent"],
    default: "normal"
  },
  
  // Resolution details
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  resolvedAt: Date,
  resolution: {
    type: String,
    enum: ["warning_issued", "suspension", "permanent_ban", "compensation", "training_required", "no_action", "other"]
  },
  resolutionNotes: String,
  compensationAmount: Number,
  suspensionDuration: Number, // in days
  
  // Follow-up actions
  followUpRequired: {
    type: Boolean,
    default: false
  },
  followUpActions: [{
    action: String,
    assignedTo: mongoose.Schema.Types.ObjectId,
    dueDate: Date,
    completed: { type: Boolean, default: false },
    completedAt: Date,
    notes: String
  }],
  
  // Communication log
  communicationLog: [{
    type: {
      type: String,
      enum: ["email", "sms", "call", "in_app", "note"]
    },
    direction: {
      type: String,
      enum: ["incoming", "outgoing"]
    },
    content: String,
    timestamp: { type: Date, default: Date.now },
    performedBy: mongoose.Schema.Types.ObjectId
  }],
  
  // Additional metadata
  tags: [String],
  internalNotes: String,
  isConfidential: {
    type: Boolean,
    default: false
  }
}, { 
  timestamps: true 
});

// Indexes
incidentSchema.index({ reporter: 1, createdAt: -1 });
incidentSchema.index({ reportedAgainst: 1 });
incidentSchema.index({ status: 1, priority: -1 });
incidentSchema.index({ assignedTo: 1 });
incidentSchema.index({ type: 1 });
incidentSchema.index({ createdAt: -1 });

// Virtual for incident age in days
incidentSchema.virtual('ageInDays').get(function() {
  return Math.floor((new Date() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Method to assign incident
incidentSchema.methods.assign