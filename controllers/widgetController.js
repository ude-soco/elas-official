const widgetModel = require("../model/widgetModel.js");
const sectionModel = require("../model/sectionModel.js");
const HttpError = require("../model/http-error.js");

// Get widgets by section id
const getWidgetsBySectionId = async (req, res, next) => {
    const { section_id } = req.params;

    try {
        const section = await sectionModel.findById(section_id).populate("widgets");
    
        if (!section.widgets || section.widgets.length === 0) {
            return res.status(404).json({ message: "Section not found." });
        }

        res.json({ widgets: section.widgets.map((widget) => widget.toObject({ getters: true })) });
    } catch (err) {
        const error = new HttpError("An error occurred while fetching widgets.", 500);
        return next(error);
    }
};



//Add a widget to a section
const addWidgetToSection = async (req, res, next) => {
    const { section_id } = req.params;
    const { type, data } = req.body; // Assuming the type and data for the widget are available in the request body
  
    try {
      const section = await sectionModel.findById(section_id);
  
      if (!section) {
        return res.status(404).json({ message: "Section not found." });
      }
  
      // Create a new widget object
      const widget = new widgetModel({
        type,
        data,
        section_id: section._id,
      });
  
      // Save the new widget
      await widget.save();
  
      // Update the section's widgets array with the newly created widget
      section.widgets.push(widget._id);
      await section.save();
  
      res.json({ message: "Widget added to the section." });
    } catch (err) {
        const error = new HttpError("An error occurred while adding the widget to the section.", 500);
        return next(error);
    }
  };

// create widget
const createWidget = async (req, res, next) => {
  const { type, data, section_id } = req.body;

  try {
    // Input validation and error handling...

    const createdWidget = new widgetModel({
      type,
      data,
      section_id,
    });

    await createdWidget.save();

    res.status(201).json({ message: "Widget created!", widget: createdWidget });
  } catch (err) {
    const error = new HttpError("An error occurred while creating the widget.", 500);
    return next(error);
  }
};

    //delete widget from section
    //const deleteWidget = async (req, res, next) => { ... }

    //update widget
    //const updateWidget = async (req, res, next) => { ... }

    exports.getWidgetsBySectionId = getWidgetsBySectionId;
    exports.addWidgetToSection = addWidgetToSection;
    exports.createWidget = createWidget;