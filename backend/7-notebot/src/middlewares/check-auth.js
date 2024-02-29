module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" "); // Extract the token correctly
    console.log("Token in check_auth:", token);

    if (!token) {
      console.error("No token provided");
      return res.status(401).json({ message: "Authentication failed: No token provided" });
    }

    // Add user data to the request object
    req.token = token;

    // Pass the request to the next middleware
    next();
  } catch (err) {
    console.error("Error while processing token:", err.message);
    return res.status(401).json({ message: "Authentication failed: Error while processing token" });
  }
};
