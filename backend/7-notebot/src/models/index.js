const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const db = {};
db.mongoose = mongoose;

/***************** START: EXPORT SCHEMA AS MODULE *****************
 * @documentation
 * Export the schema as a module. This will allow you to import the
 * schema in other files.
 */
db.user = require("./user.model.js");
/***************** END: EXPORT SCHEMA AS MODULE *****************/

module.exports = db;