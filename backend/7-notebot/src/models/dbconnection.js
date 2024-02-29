require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();

const mongoURLDb = process.env.MONGO_DB;
// Extracting the database name from the mongoURLDb
const urlParts = mongoURLDb.split('/');
const dbName = urlParts[urlParts.length - 1];

console.log(mongoURLDb);

// Connect to MongoDB
mongoose.connect(mongoURLDb, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    if (process.env.OPENAI_API_KEY) {
      console.log("\n*********** OpenAI API key found ***********");
    } else {
      console.log("\n!! OpenAI API key not found !!");
    }

    console.log("\n*********** Connected to MongoDB ***********\n");
    console.log(`************ Database: ${dbName} *************\n`);
    console.log(`******* Server started at port ${process.env.PORT || "3000"} ********`);
  })
  .catch((error) => {
    console.error("!! Error connecting to MongoDB !!", error);
    process.exit(1); // Exit the process with an error code
  });

module.exports = mongoose;