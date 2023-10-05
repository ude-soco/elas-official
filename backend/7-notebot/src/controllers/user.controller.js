const db = require("../models");
const User = db.user;

/***************** START: SAVE USER USING A CONTROLLER *****************
 * @documentation
 *
 * @function saveUser
 * The function saves a user to a database, checking if the user already
 * exists before saving.
 * @param req - The `req` parameter is the request object that contains
 * information about the HTTP request made by the client. It includes 
 * details such as the request method, headers, and body.
 * @param res - The `res` parameter is the response object that is used to
 * send the response back to the client. It contains methods and properties
 * that allow you to control the response, such as setting the status code
 * and sending the response body.
 * @returns a response with a status code and a message. If the user
 * already exists in the database, it will return a 401 status code and a
 * message stating "User already exists in your database". If the user is
 * successfully created and stored in the database, it will return a 200
 * status code and a message stating "User {username} created and stored
 * in your database". If there is an error saving the user to the database,
 * it will return a 500 status code and a message stating "Error saving
 * user to your database".
 *
 */
export const saveUser = async (req, res) => {
  try {
    let user = new User({
      firstname: "Max",
      lastname: "Müller",
      username: "maxmüller",
      password: "12345678",
    });
    let foundUser = await User.findOne({ username: user.username });
    if (foundUser) {
      return res.status(401).send(`User already exists in your database`);
    }
    await user.save();
    res
      .status(200)
      .send(`User ${user.username} created and stored in your database`);
  } catch (err) {
    res.status(500).send(`Error saving user to your database`);
    return;
  }
};
/***************** END: SAVE USER USING A CONTROLLER ******************/
