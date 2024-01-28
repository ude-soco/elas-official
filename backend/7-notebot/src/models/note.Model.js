// Import mongoose
const mongoose = require("mongoose");

// Define the schema
const noteSchema = new mongoose.Schema({
  archive_from_id: {
    type: String,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'users'
  },
  title: {
    type: String,
    required: true,
  },
  avg_rate: {
    type: String,
    required: false,
  },
  isPublic: {
    type: Boolean,
    required: true,
  },
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'courses'
  },
  sections: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'sections'
  }],
  saved_by: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  }],
  ratings: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    rating: { type: Number, min: 1, max: 5, required: true },
  }],
}, { timestamps: true });

// Create and export the model
const noteModel = mongoose.model('notes', noteSchema);

module.exports = noteModel;
