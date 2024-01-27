require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");

const dbName = process.env.DB_NAME;
const mongoURL = process.env.MONGODB_URL;

// Connect to MongoDB Atlas
mongoose
  .connect(mongoURL, { dbName })
  .then(() => {
    if (Boolean(process.env.OPENAI_API_KEY)) {
      console.log(`\n*********** OpenAI API key found ***********`);
    } else {
      console.log("\n!! OpenAI API key not found !!");
    }

    console.log("\n*********** Connected to MongoDB ***********\n");
    console.log(
      `************ Database: ${process.env.DB_NAME} *************\n`
    );
    console.log(`******* Server started at port ${process.env.PORT || "3000"} ********`);
  })
  .catch((error) => {
    console.error("!! Error connecting to MongoDB Atlas !!");
  });

module.exports = mongoose;
