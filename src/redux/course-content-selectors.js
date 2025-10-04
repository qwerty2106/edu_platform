import { createSelector } from "reselect";

export const getCourses = (state) => state.courses.courses;
export const getModules = (state) => state.courses.modules;
export const getLessons = (state) => state.courses.lessons;

export const getCourseContent = createSelector([getModules, getLessons], (modules, lessons) => {
    if (!modules || !lessons) {
        return [];
    }
    return modules.map(module => ({
        ...module,  //Копируем все поля модуля и добавляем поле с уроками
        lessons: lessons.filter(lesson => lesson.module_id === module.id)
    }))
})



