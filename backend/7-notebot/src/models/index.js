const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;

/***************** START: EXPORT SCHEMA AS MODULE *****************
 * @documentation
 * Create a schema for MongoDB.
 */
db.user = require("./user.model");
/***************** END: EXPORT SCHEMA AS MODULE *****************/

module.exports = db;
