const controller = require("../controllers/user.controller");

let userRouter = require("express").Router();

userRouter.use(function (req, res, next) {
  res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
  next();
});

userRouter.get("/users", controller.allAccess);

module.exports = userRouter;
