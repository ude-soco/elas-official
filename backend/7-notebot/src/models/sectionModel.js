const mongoose = require("mongoose");

// Initialize parameters
const collectionName_sections = "sections";
//define structure of the documents in a collection
const sectionSchema = new mongoose.Schema({
  layout_field: {
    type: [Number],
  },
  note_id: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "notes",
  },
  widgets: [
    {
      type: mongoose.Types.ObjectId,
      ref: "widgets",
    },
  ],
});

const sectionModel = mongoose.model(collectionName_sections, sectionSchema);

module.exports = sectionModel;
