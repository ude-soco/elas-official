const mongoose = require("mongoose");

const WIDGET_TYPES = require("./widgetTypes");
// Initialize parameters
const collectionName_widgets = "widgets";

// Define structure of the documents in a collection
const widgetSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: Object.values(WIDGET_TYPES), // Ensure the type matches one of the predefined widget types
  },
  data: {
    type: Object,
    required: true,
  },
  layout_index: {
    type: Number,
    required: true,
  },
  section_id: {
    type: mongoose.Schema.Types.ObjectId, // Correct the reference to Schema.Types.ObjectId
    required: true,
    ref: "sections", // Assuming "sections" is the correct reference model name
  },
});

const widgetModel = mongoose.model(collectionName_widgets, widgetSchema);

module.exports = widgetModel;
