const userModel = require("./userModel");
const courseModel = require("./courseModel");
const noteModel = require("./note.Model");
const sectionModel = require("./sectionModel");
const widgetModel = require("./widgetModel");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const WIDGET_TYPES = require('./widgetTypes')
const notes = [
  {
    archive_from_id: "",
    user_id: new ObjectId("648e5cefbcc734cb9c7a2e9d"),
    title: "Notes in AWT",
    avg_rate: "4",
    isPublic: 1,
    course_id: new ObjectId("648edb4dcd3c0c4995edf5f3"),
  },
  {
    archive_from_id: "",
    user_id: new ObjectId("648e5cefbcc734cb9c7a2e9d"),
    title: "Notes in ILE",
    avg_rate: "4",
    isPublic: 1,
    course_id: new ObjectId("648edb4dcd3c0c4995edf5f3"),
  },
];

const users = [
  {
    name: "hlahussain@gmail.com",
    username: "Hla",
    uid: "123456",
  },
];


const courses = [
  {
    title: "Advanced Web Tech",
  },
  {
    title: "Intelligent learning environment ",
  },
];

const ratings = [
  {

    object_id: new ObjectId("648edc88e93a0adfc523e3c8"),
    object_type: "stars",
    rating: "4",
  },
  {
    object_id: new ObjectId("648edc88e93a0adfc523e3c9"),
    object_type: "stars",
    rating: "4",
  },
];


const sections = [
  {
    layout_type: 1,
    note_id: new ObjectId("648edc88e93a0adfc523e3c8"),
  },
  {
    layout_type: 2,
    note_id: new ObjectId("648edc88e93a0adfc523e3c9"),
  },
];
const widgets = [
  {
    type: WIDGET_TYPES.TEXT,
    section_id: new ObjectId("648edcd8c9c93a7adf985b5a"),    
    data: {
      "text": `JavaScript runtime environment built on Chrome’s V8 Engine
      • Allows executing JavaScript code outside of a web browser
      • Enable server-side and command- line application development`,
    },
  },
  {
    type: WIDGET_TYPES.TEXT,
    section_id: new ObjectId("648edcd8c9c93a7adf985b5a"),
    data: {
      "text": `JavaScript runtime environment built on Chrome’s V8 Engine
    • Allows executing JavaScript code outside of a web browser
    • Enable server-side and command- line application development`,
    },
  },

  {
    type: WIDGET_TYPES.PDF,
    section_id: new ObjectId("648edcd8c9c93a7adf985b5a"),
    data: {
      "pdf_url": ''
    },
  },
];

async function insertDB() {

  try {
    await userModel.insertMany(users)
    await noteModel.insertMany(notes)
    await sectionModel.insertMany(sections)
    await widgetModel.insertMany(widgets);
    await courseModel.insertMany(courses)

    console.log("Successfully inserted to DB");
  } catch (err) {
    console.log("Error inserting to DB", err);
  }
}

insertDB();
module.exports = insertDB;
