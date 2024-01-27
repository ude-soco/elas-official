const mongoose = require("mongoose");

const WIDGET_TYPES = require("./widgetTypes");
// Initialize parameters
const collectionName_widgets = "widgets";

//define structure of the documents in a collection
const widgetSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
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
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "sections",
  },
});

const widgetModel = mongoose.model(collectionName_widgets, widgetSchema);

module.exports = widgetModel;
