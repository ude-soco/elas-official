const sectionController = require('../controllers/sectionController');
const userRouter = require("express").Router();

//Registering sections route
// the rest of the path , pointer to the function from sectionController
userRouter.get('/note/:note_id', sectionController.getSectionsByNoteId);
userRouter.post('/section', sectionController.createSection);
userRouter.patch('/section:section_id', sectionController.updateSection);
userRouter.patch('/section/note/:note_id', sectionController.addSectionToNote);
userRouter.patch('/section:section_id/widgets', sectionController.updateSectionWidgets);
userRouter.delete('/section:note_id/:section_id', sectionController.deleteSection);

userRouter.patch('/push_widgets', sectionController.pushWidgetsToSection);
//export the router
module.exports = userRouter;