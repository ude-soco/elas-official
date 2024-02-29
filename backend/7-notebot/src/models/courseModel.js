const mongoose = require("./dbconnection.js");

const collectionName_courses = 'courses';

// Define structure of the documents in a collection
const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  notes: [{ 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'notes'
  }],
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

const courseModel = mongoose.model(collectionName_courses, courseSchema);

module.exports = courseModel;
