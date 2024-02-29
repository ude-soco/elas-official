const favoriteModel = require("../models/favoriteModel");
const mongoose = require("mongoose");
const HttpError = require("../models/http-error");
const noteModel = require("../models/note.Model");

// Function to toggle favorite note status
const toggetFavoriteNote = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  const user_id = req.userData.userId;
  const { note_id } = req.params;
  const payload = {
    note_id: note_id,
    user_id: user_id,
  };
  try {
    // Check if the note is already favorited by the user
    const favorite = await favoriteModel.findOne(payload);

     // If the note is already favorited, remove it from favorites
    // If not, add it to favorites
    if (favorite) {
      await favoriteModel.deleteOne(payload);
    } else {
      const favorite = new favoriteModel(payload);
      await favorite.save({ session });
    }

    // Commit the transaction and end the session
    await session.commitTransaction();
    await session.endSession();

    res.status(201).json({
      message: "Updated successfully !",
    });
  } catch (err) {
    console.log(err);
    const error = new HttpError(" please try again later.", 500);
    await session.abortTransaction();
    await session.endSession();

    return next(error);
  }
};

// Get favorite notes by user ID
const getFavNoteByUserId = async (req, res, next) => {
  const { user_id } = req.params;

  console.log("user_id", user_id);

  try {
    const groupedNotes = [];

    // Find all favorites of the user
    let favorites = await favoriteModel.find({
      user_id: user_id,
      // note_id: { $in: user.notes },
    });

    // Find notes corresponding to the favorite notes
    const notes = await noteModel.find({
      _id: { $in: favorites.map((favorite) => favorite.note_id) },
    });

    console.log(notes)

    // Respond with the notes along with the favorite status
    res.json({
      notes: notes.map((note) => ({
        ...note._doc,
        isFavorite: true,
      })),
    });
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "An error occurred while fetching notes. ",
      500
    );
    return next(error);
  }
};

exports.toggetFavoriteNote = toggetFavoriteNote;
exports.getFavNoteByUserId = getFavNoteByUserId;
