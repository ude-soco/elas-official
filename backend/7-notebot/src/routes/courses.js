const courseController = require("../controllers/courseController");
const userRouter = require("express").Router();

userRouter.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

//Registering courses route
// the rest of the path , pointer to the function from courseController
userRouter.get('/course/user/:user_id', courseController.getCoursesByUserId); // Courses page (Grid view): when click on Courses in the Dashboard page
userRouter.post('/course', courseController.createCourse); // AddCourse button in the Dashboard page
userRouter.delete('/course/:course_id', courseController.deleteCourseWithNotes); // Clicking on the delete icon in the Courses page

userRouter.get('/course/test', courseController.getAllCourses); // Show more link in the Courses page

//export the userRouter
module.exports = userRouter;