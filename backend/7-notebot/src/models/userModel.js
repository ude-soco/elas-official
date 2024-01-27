const mongoose = require("mongoose");

// Initialize parameters
const collectionName_users = 'users';

//define structure of the documents in a collection
const userSchema = new mongoose.Schema({

  email: {
    type: String,
    required: true,
  },
  user_name: {
    type: String,
    required: true,
  },
  study_field: {
    type: String,
    required: true,
  },
  notes: [{ 
    type: mongoose.Types.ObjectId,
    ref:'notes'
  }],
  courses: [{
    type: mongoose.Types.ObjectId,
    ref:'courses'
  }],
});

const userModel = mongoose.model(collectionName_users, userSchema);

module.exports = userModel;