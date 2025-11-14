const express = require('express');

const courseController = require("../controllers/courseController");
const courseRouter = express.Router();

courseRouter.get('/courses', courseController.getCourses);
courseRouter.get('/courses/:courseID', courseController.getCourseContent);
courseRouter.get('/lessons/:lessonID', courseController.getCurrentLesson);
courseRouter.post('/courses/:courseID/:moduleID/:lessonID', courseController.completeLesson);


module.exports = courseRouter;
