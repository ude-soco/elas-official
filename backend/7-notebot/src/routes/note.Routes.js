const noteController = require("../controllers/noteController");
const favController = require("../controllers/favoriteController");

const userRouter = require("express").Router();

// Middleware for setting headers
userRouter.use(function (req, res, next) {
  res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
  next();
});

// Register routes
userRouter.get("/note:note_id/widgets", noteController.getNoteWidgets);
userRouter.get("/note/user:user_id", noteController.getNoteByUserId);
userRouter.post("/note/create", noteController.createNote);
userRouter.put("/note:note_id", noteController.updateNote);
userRouter.delete("/note:note_id", noteController.deleteNote);
userRouter.get(
  "/note/users:user_id/courses:course_id/notes",
  noteController.getNotesByUserIdAndCourseId
);
userRouter.get("/note/search:keyword", noteController.getNotesByCourseTitle);
userRouter.get("/note/users:user_id/savednotes", noteController.getSavedNotesByUserId);
userRouter.post("/note/users:user_id/notes:note_id/save", noteController.saveNote);
userRouter.patch("/note/push_sections", noteController.pushSectionsToNote);
userRouter.get("/note:note_id", noteController.getNoteByNoteID);
// userRouter.post(":note_id/favorite", favController.toggleFavoriteNote);
userRouter.get("/note/users:user_id/favorite", favController.getFavNoteByUserId);
userRouter.post('/note/update_rating', noteController.updateRating);

userRouter.get('/test', (req, res) => {
  res.send('Test route is working fine!');
});

// Export the router
module.exports = userRouter;