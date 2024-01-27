var userRouter = require("express").Router();

/* GET home page. */
userRouter.get('/', function(req, res, next) {
  return res.render('index', { title: 'Express' });
});

module.exports = userRouter;
