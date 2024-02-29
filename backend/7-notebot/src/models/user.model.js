/******
 * @Note This is one example, you can create more model files under
 * the models folder and export them. Make sure you import the models
 * in the index.js file under models folder.
 */

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

/***************** START: DEFINE A SCHEMA *****************
 * @documentation
 * A user schema for MongoDB.
 */
const UserSchema = new Schema({
  uid: { type: String, required: true },
  name: { type: String, required: true },
  username: { type: String, required: true },
  study_field: {
    type: String,
  },
  notes: [{ 
    type: mongoose.Types.ObjectId,
    ref:'notes'
  }],
  courses: [{
    type: mongoose.Types.ObjectId,
    ref:'courses'
  }],
});
/***************** END: DEFINE A SCHEMA *****************/

module.exports = mongoose.model("User", UserSchema);
