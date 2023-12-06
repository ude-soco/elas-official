const favoriteModel = require("../model/favoriteModel");
const mongoose = require("mongoose");
const HttpError = require("../model/http-error");
const noteModel = require("../model/noteModel");

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
    const favorite = await favoriteModel.findOne(payload);

    if (favorite) {
      await favoriteModel.deleteOne(payload);
    } else {
      const favorite = new favoriteModel(payload);
      await favorite.save({ session });
    }

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

// Get user notes by user_id
const getFavNoteByUserId = async (req, res, next) => {
  const { user_id } = req.params;

  console.log("user_id", user_id);

  try {
    const groupedNotes = [];

    let favorites = await favoriteModel.find({
      user_id: user_id,
      // note_id: { $in: user.notes },
    });

    const notes = await noteModel.find({
      _id: { $in: favorites.map((favorite) => favorite.note_id) },
    });

    console.log(notes)

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
