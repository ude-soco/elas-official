const mongoose = require("mongoose");

// Initialize parameters
const collectionName_favorite = 'favoriteNotes';

//define structure of the documents in a collection
const favNotesSchema = new mongoose.Schema({


  note_id: [{ 
    type: mongoose.Types.ObjectId,
    required: true,
    ref:'notes'
  }],
  user_id: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref:'users'
  },

});

const favoriteModel = mongoose.model(collectionName_favorite, favNotesSchema);

module.exports = favoriteModel;