const ObjectId = require("mongoose").Types.ObjectId;
const db = require("../models");
const User = db.user;

/**
 * @function allAccess
 * Test public access to all type of user roles
 *
 */
export const allAccess = (req, res) => {
  res.status(200).send("Public content");
};
