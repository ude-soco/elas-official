const mongoose = require("./dbconnection.js");
// Initialize parameters
const collectionName_users = 'users';

//define structure of the documents in a collection
const userSchema = new mongoose.Schema({

  email: {
    type: String,
  },
  user_name: {
    type: String,
  },
  study_field: {
    type: String,
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