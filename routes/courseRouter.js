const express = require('express');

const courseController = require("../controllers/courseController");
const courseRouter = express.Router();

courseRouter.get('/courses', courseController.getCourses);
courseRouter.get('/courses/:courseID', courseController.getCourseContent);
courseRouter.post('/courses/:courseID/:lessonID', courseController.completeLesson);

module.exports = courseRouter;
