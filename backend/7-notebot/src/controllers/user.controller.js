const db = require("../models");
const User = db.user;

/***************** START: GET USER INFO USING A CONTROLLER *****************
 * @documentation
 *
 * @function getUserById
 * The function `getUserById` is an asynchronous function that retrieves
 * a user from a MongoDB database based on their user ID and sends a
 * response with the user information if found, or a message indicating
 * that the user was not found.
 * @param req - The `req` parameter is an object that represents the
 * HTTP request made to the server.  * It contains information such as
 * the request method, headers, URL, and parameters.
 * @param res - The `res` parameter is the response object that is used
 * to send the response back to  * the client. It contains methods and
 * properties that allow you to control the response, such as setting
 * the status code, sending data, and setting headers.
 * @returns a response object with a status code and a message. If a
 * user is found, it also includes the found user object in the response.
 */
export const getUserById = async (req, res) => {
  try {
    const userId = req.params.userId;
    let foundUser = await User.findOne({ uid: userId });
    if (foundUser) {
      return res.status(200).send({ message: `User found!`, user: foundUser });
    }
    return res.status(200).send({ message: `User not found!` });
  } catch (err) {
    res
      .status(500)
      .send({ message: `Error saving user to your MongoDB database` });
    return;
  }
};
/***************** END: GET USER INFO USING A CONTROLLER ******************/

export const createNewUser = async (req, res) => {
  try {
    let user = new User({
      uid: req.body.uid,
      name: req.body.name,
      username: req.body.username,
    });
    let foundUser = await User.findOne({ username: user.username });
    if (foundUser) {
      return res
        .status(200)
        .send({ message: `User already exists in your MongoDB database` });
    }
    await user.save();
    res.status(200).send({
      message: `User ${user.username} created and stored in your MongoDB database`,
    });
  } catch (err) {
    res
      .status(500)
      .send({ message: `Error saving user to your MongoDB database` });
    return;
  }
};
