import { createSelector } from "reselect";

export const getCourses = (state) => state.courses.courses;
export const getCoursesCount = (state) => state.courses.coursesCount;
export const getModules = (state) => state.courses.modules;
export const getLessons = (state) => state.courses.lessons;
export const getLoadingCourses = (state) => state.courses.isLoading;


export const getCourseModules = createSelector([getModules, getLessons], (modules, lessons) => {
    return modules.map(module => ({
        ...module,  //Копируем все поля модуля и добавляем поле с уроками
        lessons: lessons.filter(lesson => lesson.module_id === module.id)
    }))
})

export const getLesson = createSelector(
    [getLessons, (state, lessonID) => lessonID],
    (lessons, lessonID) => {
        return lessons.find(lesson => lesson.id == lessonID);
    });





