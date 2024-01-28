const widgetController = require("../controllers/widgetController.js");
const userRouter = require("express").Router();

//Registering widgets route
// the rest of the path , pointer to the function from widgetController
userRouter.get('/widget:section_id', widgetController.getWidgetsBySectionId);
userRouter.patch('/widget:section_id', widgetController.addWidgetToSection);
//userRouter.patch('/:widget_id', widgetController.updateWidget);
//userRouter.delete('/:section_id/:widget_id', widgetController.deleteWidget);

userRouter.post('/widget', widgetController.createWidget);
//export the router
module.exports = userRouter;