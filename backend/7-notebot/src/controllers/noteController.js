const noteModel = require("../models/note.Model");
const userModel = require("../models/userModel");
const sectionModel = require("../models/sectionModel");
const courseModel = require("../models/courseModel");
const widgetModel = require("../models/widgetModel");
const mongoose = require("mongoose");
const HttpError = require("../models/http-error");
const favoriteModel = require("../models/favoriteModel");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[0];

    if (!token) {
      return res.status(401).json({ message: "Authentication failed !!" });
    }
    const decodedToken = jwt.verify(token, "dont share");

    req.userData = { userId: decodedToken.userId };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Authentication failed !" });
  }
};


//const { validationResult } = require('express-validator');

// Get user notes by user_id
const getNoteByNoteId = async (req, res, next) => {
  const { user_id, note_id } = req.params;

  try {
    const note = await noteModel.findById(note_id);

    if (!note) {
      return res
        .status(404)
        .json({ message: "Could not find notes for the provided user id." });
    }

    for (const section_id of note.sections) {
      const section = await sectionModel.findById(section_id);

      if (section) {
        for (let widget_ids of section) {
          const widget = await widgetModel.findById(widget_ids);
        }
      }
    }

    res.json({ notes: groupedNotesArray });
  } catch (err) {
    const error = new HttpError(
      "An error occurred while fetching notes. ",
      500
    );
    return next(error);
  }
};

//Get all notes by user_id and course_id
const getNotesByUserIdAndCourseId = async (req, res, next) => {
  const { user_id, course_id } = req.params;

  try {
    const user = await userModel.findById(user_id).populate("notes");

    if (!user.notes || user.notes.length === 0) {
      return res
        .status(404)
        .json({ message: "Could not find notes for the provided user id." });
    }

    res.json({
      notes: user.notes
        .filter((note) => note.course_id.toString() === course_id)
        .map((note) => note.toObject({ getters: true })),
    });
  } catch (err) {
    const error = new HttpError(
      "An error occurred while fetching notes. ",
      500
    );
    return next(error);
  }
};

// Get user notes by user_id
const getNoteByUserId = async (req, res, next) => {
  const { user_id } = req.params;

  try {
    const user = await userModel.findById(user_id).populate("notes");

    if (!user.notes || user.notes.length === 0) {
      res.json({ notes: [] });
      return;
    }

    //res.json({ notes: user.notes.map(note => note.toObject({ getters: true })) });
    // Group notes by course ID
    const groupedNotes = {};

    let favorites = await favoriteModel.find({
      user_id: user_id,
      note_id: { $in: user.notes },
    });

    favorites = favorites.reduce((acc, fav) => {
      return {
        ...acc,
        [fav.note_id]: true,
      };
    }, {});

    for (let note of user.notes) {
      const courseId = note.course_id._id.toString();

      let course;
      if (courseId) {
        course = await courseModel.findById(courseId);
      }

      if (!course) {
        course = {
          _id: "",
          title: "Without course",
        };
      }

      if (!groupedNotes[courseId]) {
        groupedNotes[courseId] = {
          course_id: course._id,
          course_title: course.title,
          notes: [],
        };
      }

      groupedNotes[courseId].notes.push({
        ...note._doc,
        isFavorite: Boolean(favorites[note._id]),
      });
    }

    // Convert the grouped notes object to an array
    const groupedNotesArray = Object.values(groupedNotes);

    res.json({ notes: groupedNotesArray });
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "An error occurred while fetching notes. ",
      500
    );
    return next(error);
  }
};

// Get all notes by course title
const getNotesByCourseTitle = async (req, res, next) => {
  const searchKeyword = req.params.keyword;

  try {
    // Get all courses that match the search keyword
    const courses = await courseModel.find({
      title: { $regex: searchKeyword, $options: "i" },
    });
    const courseIds = courses.map((course) => course._id);

    // Get all notes that match the course ids
    const notes = await noteModel
      .find({ course_id: { $in: courseIds } })
      .populate("course_id", "title")
      .populate("user_id", "user_name")
      .select("note_id title");

    const user_id = req.userData.userId;

    let favorites = await favoriteModel.find({
      user_id,
      note_id: { $in: notes.map((note) => note._id.toString()) },
    });

    favorites = favorites.reduce(
      (acc, fav) => ({
        ...acc,
        [fav.note_id]: true,
      }),
      {}
    );

    res.json(
      notes.map((note) => ({
        ...note._doc,
        isFavorite: Boolean(favorites[note._id]),
      }))
    );
  } catch (err) {
    const error = new HttpError(
      "An error occurred while fetching notes. ",
      500
    );
    return next(error);
  }
};

const createNoteWithEmptySections = async (req, res, next) => {
  const { user_id, title, isPublic, course_id } = req.body;

  try {
    // Input validation and error handling...

    const createdNote = new noteModel({
      user_id,
      title,
      isPublic,
      course_id,
      sections: [],
    });

    await createdNote.save();

    res.status(201).json({ message: "Note created!", note: createdNote });
  } catch (err) {
    const error = new HttpError(
      "Creating note failed, please try again later.",
      500
    );
    return next(error);
  }
};

// push a section to a note
const pushSectionsToNote = async (req, res, next) => {
  const { note_id, section_ids } = req.body;

  try {
    // Input validation and error handling...
    const note = await noteModel.findById(note_id);

    if (!note) {
      return res.status(404).json({ message: "Note not found." });
    }

    note.sections.push(...section_ids);
    await note.save();

    res.status(200).json({ message: "Sections added to note.", note });
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Adding sections to note failed, please try again later.",
      500
    );
    return next(error);
  }
};

const createNote = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  const user_id = req.userData;

  const { title, isPublic, course_id, sections, widgets } = req.body;

  try {
    // Input validation
    if (!user_id || !title || !course_id || !sections || !widgets) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const [user, course] = await Promise.all([
      userModel.findById(user_id),
      courseModel.findById(course_id),
    ]);

    if (!user.notes) {
      user.notes = [];
    }

    if (!user) {
      return res
        .status(404)
        .json({ message: "Could not find user for the provided id." });
    }
    if (!course) {
      return res
        .status(404)
        .json({ message: "Could not find course for the provided id." });
    }

    const createdNote = new noteModel({
      title: title,
      isPublic: true,
      avg_rate: 4,
      course_id: course_id,
      user_id: user_id,
    });
    await createdNote.save({ session });

    for (const section of sections) {
      const sectionObject = new sectionModel({
        layout_field: section.layout_field,
        note_id: createdNote._id,
      });
      await sectionObject.save({ session });

      createdNote.sections.push(sectionObject._id);
      await createdNote.save({ session });

      if (widgets[section.id]) {
        for (let widgetIndex in widgets[section.id]) {
          const widget = widgets[section.id][widgetIndex];

          const widgetObject = new widgetModel({
            type: widget.type,
            data: widget.data,
            layout_index: parseInt(widgetIndex),
            section_id: sectionObject._id,
          });

          await widgetObject.save({ session });

          sectionObject.widgets.push(widgetObject._id);
        }
        await sectionObject.save({ session });
      }
    }

    user.notes.push(createdNote._id);

    await user.save({ session });
    await session.commitTransaction();
    await session.endSession();

    res.status(201).json({
      message: "Note , Sections , Widgets created successfully !",
      note: createdNote,
    });
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Adding Note , Sections , Widgets failed! please try again later.",
      500
    );
    await session.abortTransaction();
    await session.endSession();

    return next(error);
  }
};

//delete note
const deleteNote = async (req, res, next) => {
  const note_id = req.params.note_id;

  try {
    const note = await noteModel.findById(note_id);

    if (!note) {
      return res
        .status(404)
        .json({ message: "Could not find note for the provided id." });
    }

    if (note.user_id.toString() !== req.userData.userId) {
      return res
        .status(401)
        .json({ message: "You don't have permissions to delete this note." });
    }

    const user = await userModel.findById(note.user_id);
    const course = await courseModel.findById(note.course_id);

    await noteModel.deleteOne({
      _id: note_id,
    });

    const widgets = await widgetModel.find({
      section_id: { $in: note.sections },
    });

    const widgetIds = widgets.map((widget) => widget._id);

    user.notes.pull(note._id);
    course.notes.pull(note._id);

    await Promise.all([
      user.save(),
      course.save(),
      sectionModel.deleteMany({
        _id: {
          $in: note.sections,
        },
      }),
      widgetModel.deleteMany({
        _id: {
          $in: widgetIds,
        },
      }),
    ]);

    res.json({ message: "Note deleted!", note });
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Deleting note failed, please try again later.",
      500
    );
    return next(error);
  }
};

// save note
const saveNote = async (req, res, next) => {
  const { user_id, note_id } = req.params;

  try {
    // Find the user by user_id
    const user = await userModel.findById(user_id);

    if (!user) {
      return res
        .status(404)
        .json({ message: "Could not find user for the provided id." });
    }

    // Find the note by note_id
    const note = await noteModel.findById(note_id);

    if (!note) {
      return res
        .status(404)
        .json({ message: "Could not find note for the provided id." });
    }

    // Check if the user who wrote the note is different from the user trying to save it
    if (note.user_id.toString() === user._id.toString()) {
      return res
        .status(400)
        .json({ message: "Cannot save a note written by yourself." });
    }

    // Check if the user has already saved the note
    const isNoteSaved = note.saved_by.includes(user._id);

    if (isNoteSaved) {
      return res
        .status(400)
        .json({ message: "Note is already saved by the user." });
    }

    // Save the note for the user
    note.saved_by.push(user._id);
    await note.save();

    res.json({ message: "Note saved successfully." });
  } catch (err) {
    const error = new HttpError(
      "An error occurred while saving the note.",
      500
    );
    return next(error);
  }
};

//get saved notes of a user
const getSavedNotesByUserId = async (req, res, next) => {
  const { user_id } = req.params;

  try {
    const notes = await noteModel
      .find({ saved_by: user_id })
      .populate("course_id", "title")
      .populate("user_id", "user_name")
      .select("note_id title");

    res.json(notes);
  } catch (err) {
    const error = new HttpError("An error occurred while fetching notes.", 500);
    return next(error);
  }
};

//get all notes
const getNotes = async (req, res, next) => {
  try {
    const notes = await noteModel.find();
    res.json({ notes: notes.map((note) => note.toObject({ getters: true })) });
  } catch (err) {
    const error = new HttpError(
      "An error occurred while fetching notes. ",
      500
    );
    return next(error);
  }
};

const getNoteByNoteID = async (req, res, next) => {
  const { note_id } = req.params;

  try {
    const note = await noteModel.findById(note_id);

    if (!note) {
      return res
        .status(404)
        .json({ message: "Could not find note for the provided ID." });
    }

    res.json({ note: note.toObject({ getters: true }) });
  } catch (err) {
    const error = new HttpError(
      "An error occurred while fetching the note.",
      500
    );
    return next(error);
  }
};

const getNoteWidgets = async (req, res, next) => {
  try {
    const note = await noteModel.findById(req.params.note_id);
    const sections = await sectionModel.find({ _id: { $in: note.sections } });

    const indexDictionary = note.sections.reduce(
      (acc, id, index) => ({
        ...acc,
        [id]: index,
      }),
      {}
    );

    sections.sort((a, b) => {
      const aIndex = indexDictionary[a._id];
      const bIndex = indexDictionary[b._id];
      if (aIndex < bIndex) {
        return -1;
      }
      if (aIndex > bIndex) {
        return 1;
      }

      return 0;
    });
    const widgets = await widgetModel.find({
      section_id: { $in: note.sections },
    });

    res.json({ note, sections, widgets });
  } catch (err) {
    const error = new HttpError(
      "An error occurred while fetching notes. ",
      500
    );
    return next(error);
  }
};

const updateNote = async (req, res, next) => {
  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    const user_id = req.userData.userId;

    const { title, sections, widgets, course } = req.body;

    const note = await noteModel.findById(req.params.note_id);

    if (!note) {
      return res
        .status(404)
        .json({ message: "Could not find note for the provided id." });
    }

    note.title = title;
    note.course_id = course;

    await note.save({ session });
    note.sections = [];

    for (const section of sections) {
      let sectionObject =
        section._id && (await sectionModel.findById(section._id));

      if (!sectionObject) {
        sectionObject = new sectionModel();
      }

      sectionObject.layout_field = section.layout_field || undefined;
      sectionObject.note_id = note._id;

      await sectionObject.save({ session });

      if (!note.sections.find((_id) => _id === sectionObject._id)) {
        note.sections.push(sectionObject._id);
      }

      const sectionWidgets = widgets[section._id || section.id];
      if (sectionWidgets) {
        for (let widgetIndex in sectionWidgets) {
          const widget = sectionWidgets[widgetIndex];

          let widgetObject =
            widget._id && (await widgetModel.findById(widget._id));

          if (!widgetObject) {
            widgetObject = new widgetModel();
          }

          widgetObject.type = widget.type;
          widgetObject.data = widget.data;
          widgetObject.layout_index = parseInt(widgetIndex);
          widgetObject.section_id = sectionObject._id;

          await widgetObject.save({ session });

          sectionObject.widgets.push(widgetObject._id);
        }
        await sectionObject.save({ session });
      }
    }

    await note.save({ session });

    await session.commitTransaction();
    await session.endSession();

    res.json({ note, sections, widgets });
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "An error occurred while fetching notes. ",
      500
    );
    return next(error);
  }
};

// Update Note Rating
const updateRating = async (req, res, next) => {
  const { noteId, userId, rating } = req.body;
  console.log("Received parameters: noteId =", noteId, "userId =", userId, "rating =", rating);
  try {
    let updatedNote;

    // Check if the user has rated before for this note
    const existingRating = await noteModel.findOne({
      _id: noteId,
      "ratings.userId": userId,
    });

    if (existingRating) {

      // Update the existing rating
      updatedNote = await noteModel.findOneAndUpdate(
        { _id: noteId, "ratings.userId": userId },
        { $set: { "ratings.$.rating": rating } },
        { new: true }
      );
    } else {
      
      // Add a new rating if the user is rating for the first time
      updatedNote = await noteModel.findOneAndUpdate(
        { _id: noteId },
        { $push: { ratings: { userId, rating } } },
        { new: true }
      );
    }
    console.log("Updated note:", updatedNote);
    if (!updatedNote) {
      return res
        .status(404)
        .json({ message: "Could not find note or user rating." });
    }

    res.status(200).json({
      message: "Note rating updated!",
      note: updatedNote,
    });
  } catch (err) {
    console.error("Error updating note rating:", err);
    const error = new HttpError(
      "Updating note rating failed, please try again later.",
      500
    );
    return next(error);
  }
};

module.exports = {
  getNoteWidgets: getNoteWidgets,
  getNotesByUserIdAndCourseId: getNotesByUserIdAndCourseId,
  getNoteByUserId: getNoteByUserId,
  getNotesByCourseTitle: getNotesByCourseTitle,
  createNote: createNote,
  updateNote: updateNote,
  deleteNote: deleteNote,
  saveNote: saveNote,
  getSavedNotesByUserId: getSavedNotesByUserId,
  getNoteByNoteID: getNoteByNoteID,
  createNoteWithEmptySections: createNote,
  pushSectionsToNote: pushSectionsToNote,
  updateRating: updateRating,
}