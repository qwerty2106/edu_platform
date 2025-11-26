const express = require('express');

const courseController = require("../controllers/courseController");
const { authMiddleware } = require("../middleware/authMiddleware");
const courseRouter = express.Router();

courseRouter.get('/courses', authMiddleware, courseController.getCourses);
courseRouter.get('/courses/:courseID', authMiddleware, courseController.getCourseContent);
courseRouter.get('/lessons/:lessonID', courseController.getCurrentLesson);
courseRouter.post('/lessons/:lessonID', courseController.completeLesson);


module.exports = courseRouter;
