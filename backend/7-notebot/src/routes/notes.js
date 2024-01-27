var userRouter = require("express").Router();

const noteController = require("../controllers/noteController");
const favController = require("../controllers/favoriteController");

//Registering notes route
userRouter.get("/note/:note_id/widgets", noteController.getNoteWidgets); // Grid view SavedNotes page
// the rest of the path , pointer to the function from noteController
userRouter.get("/note/user/:user_id", noteController.getNoteByUserId); //Grid view of the Dashboard page
userRouter.post("/note", noteController.createNote); // AddNote button in the Dashboard page
userRouter.put("/note:note_id", noteController.updateNote); // Clicking on a note in the Dashboard page

userRouter.delete("/note:note_id", noteController.deleteNote); // Clicking on the delete button in the NoteDetails page
userRouter.get(
  "/note/users/:user_id/courses/:course_id/notes",
  noteController.getNotesByUserIdAndCourseId
); // Show more link in the Dashboard page
userRouter.get("/note/search/:keyword", noteController.getNotesByCourseTitle); // Search bar in the Dashboard page

userRouter.get("/note/users/:user_id/savednotes", noteController.getSavedNotesByUserId); // Grid view SavedNotes page

userRouter.post("/note/users/:user_id/notes/:note_id/save", noteController.saveNote); // Clicking on the save button in the Search page

userRouter.patch("/note/push_sections", noteController.pushSectionsToNote);

userRouter.get("/note/:note_id", noteController.getNoteByNoteID);

userRouter.post("/note/:note_id/favorite", favController.toggetFavoriteNote);

userRouter.get("/fav/:user_id/favorite", favController.getFavNoteByUserId);

userRouter.post('/note/update_rating', noteController.updateRating);

// test route
// userRouter.get('/test', noteController.getNotes);

//export the userRouter
module.exports = userRouter;
