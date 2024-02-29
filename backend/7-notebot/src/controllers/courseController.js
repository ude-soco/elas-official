const courseModel = require("../models/courseModel");
const noteModel = require("../models/noteModel");
const userModel = require("../models/userModel");
const HttpError = require("../models/http-error");
const mongoose = require("mongoose");

// Function to process user ID
function processUserId(userId) {
  if (userId.length > 24) {
      userId = userId.slice(-24);
  } else if (userId.length < 24) {
      console.log("User ID is shorter than 24 characters.");
  } else {
      console.log("User ID length is correct (24 characters).");
  }
  return userId;
}

// Debugging: Get all courses
const getAllCourses = async (req, res, next) => {
  try {
    const courses = await courseModel.find();

    res.json({
      courses: courses.map((course) => course.toObject({ getters: true })),
    });
  } catch (err) {
    const error = new HttpError(
      "Fetching courses failed, please try again later.",
      500
    );
    return next(error);
  }
};

// Debugging: Get courses by user_id
const getCoursesByUserId = async (req, res, next) => {
  try {
    const user_id = req.params.user_id;
    // console.log("user_id course:", user_id);

    // Fetch user's username
    const userName = await findUserNameById(user_id);
    if (!userName) {
      // console.log('User not found.');
      return res.status(404).json({ message: 'User not found.' });
    }
    // console.log('User name:', userName);

    // Fetch courses by user_id
    const courses = await findCoursesByUserId(user_id);
    if (courses.length === 0) {
      // console.log('No courses found for the user.');
      return res.json({ courses: [] });
    }
    // console.log('Courses found:', courses);

    // Iterate over courses to fetch notes count for each course
    await Promise.all(
      courses.map(async (course) => {
        // Calculate notes count for each course
        const notes_count = course.notes.length;
        // console.log(`Notes count for course ${course.title}:`, notes_count);
        // Assign the count of notes to the course object
        course.notes_count = notes_count;
      })
    );

    // Respond with the courses and associated notes count
    // console.log("Courses with notes count:", courses);
    res.json({ courses });
  } catch (err) {
    // Handle any errors that occur during the process
    console.error("Error fetching courses:", err);
    const error = new HttpError(
      "An error occurred while fetching courses.",
      500
    );
    return next(error);
  }
};

// Function to find username by user ID
async function findUserNameById(user_id) {
  try {
    const user = await userModel.findOne({ uid: user_id });
    return user ? user.username : null;
  } catch (error) {
    console.error('Error finding user:', error);
    throw error; // Propagate the error
  }
}


// Function to find courses by user ID
async function findCoursesByUserId(user_id) {
  try {
    const courses = await courseModel.find({ user_id: user_id });
    return courses;
  } catch (error) {
    console.error('Error finding courses:', error);
    throw error; // Propagate the error
  }
}

// Debugging: Create a new course
const createCourse = async (req, res, next) => {
  
  const title = req.body.title;
  const user_id = processUserId(req.body.user_id);
  console.log("user_id: ",user_id); 
  console.log("title: ",title); 

  let session; // Declare the session variable
  
    try {
      // Start a Mongoose session
      session = await mongoose.startSession();
      session.startTransaction();
  
      // Create the course
      const createdCourse = await courseModel.create([{ user_id, title }], {
        session,
      });
      console.log("createdCourse", createdCourse);
      // Assign the course to the user
      await userModel.findByIdAndUpdate(
        user_id,
        { $push: { courses: createdCourse[0]._id } },
        { session }
      );
  
      // Commit the transaction
      await session.commitTransaction();
  
      res.status(201).json({ course: createdCourse[0] });
    } catch (error) {
      // Abort the transaction and roll back changes
      if (session) {
        await session.abortTransaction();
      }
  
      const httpError = new HttpError(
        `An error occurred while creating the course: ${error.message}`,
        500
      );
      return next(httpError);
    } finally {
      // End the session
      if (session) {
        session.endSession();
      }
    }
  };

// Debugging: Delete course and its notes
const deleteCourseWithNotes = async (req, res, next) => {
  const { course_id } = req.params;

  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const course = await courseModel.findById(course_id);

      if (!course) {
        return res
          .status(404)
          .json({ message: "Could not find course for the provided id." });
      }

      const noteIds = course.notes;
      console.log(noteIds);
      // Delete the course and its associated notes
      await Promise.all([
        courseModel.findByIdAndDelete(course_id, { session }),
        noteModel.deleteMany({ course_id: course_id }, { session }),
      ]);

      await session.commitTransaction();

      res.status(200).json({ message: "Course and associated notes deleted." });
    } catch (error) {
      console.log(error);
      // await session.abortTransaction();
      const httpError = new HttpError(
        `An error occurred while deleting the course: ${error.message}`,
        500
      );
      return next(httpError);
    } finally {
      session.endSession();
    }
  } catch (err) {
    const error = new HttpError(
      "Deleting course failed, please try again later.",
      500
    );
    return next(error);
  }
};

exports.getAllCourses = getAllCourses;
exports.getCoursesByUserId = getCoursesByUserId;
exports.deleteCourseWithNotes = deleteCourseWithNotes;
exports.createCourse = createCourse;
