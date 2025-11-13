import { CoursesAPI } from "../service/api";

const SET_COURSES = "courses/SET-COURSES";
const SET_MODULES = "courses/SET-MODULES";
const SET_LESSONS = "courses/SET-LESSONS";
const SET_LOADING = "courses/SET-LOADING";
const SET_COURSES_COUNT = "courses/SET-COURSES-COUNT";
const SET_MODULES_COUNT = "courses/SET-MODULES-COUNT"
const SET_LESSONS_COUNT = "courses/SET-LESSONS-COUNT";

const initialState = {
    courses: [],
    modules: [],
    lessons: [],
    isLoading: true,
    coursesCount: 0,
    modulesCount: 0,
    lessonsCount: 0,
}

export const coursesReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_COURSES:
            return {
                ...state,
                courses: action.courses
            }
        case SET_MODULES:
            return {
                ...state,
                modules: action.modules
            }
        case SET_LESSONS:
            return {
                ...state,
                lessons: action.lessons
            }
        case SET_LOADING:
            return {
                ...state,
                isLoading: action.isLoading
            }
        case SET_COURSES_COUNT:
            return {
                ...state,
                coursesCount: action.coursesCount
            }
        case SET_MODULES_COUNT:
            return {
                ...state,
                modulesCount: action.modulesCount
            }
        case SET_LESSONS_COUNT:
            return {
                ...state,
                lessonsCount: action.lessonsCount
            }
        default:
            return state;
    }
}

export const setCourses = (courses) => ({ type: SET_COURSES, courses });
export const setModules = (modules) => ({ type: SET_MODULES, modules });
export const setLessons = (lessons) => ({ type: SET_LESSONS, lessons });
export const setLoading = (isLoading) => ({ type: SET_LOADING, isLoading });
export const setCoursesCount = (coursesCount) => ({ type: SET_COURSES_COUNT, coursesCount });
export const setModulesCount = (modulesCount) => ({ type: SET_MODULES_COUNT, modulesCount });
export const setLessonsCount = (lessonsCount) => ({ type: SET_LESSONS_COUNT, lessonsCount });

export const requestCourses = (currentPage, pageSize, filterType, userID) => {
    return async (dispatch) => {
        dispatch(setLoading(true));
        try {
            const data = await CoursesAPI.getCourses(currentPage, pageSize, filterType, userID);
            dispatch(setCourses(data.courses));
            dispatch(setCoursesCount(data.totalCount));
        }
        catch (error) {
            console.log('Get courses error', error);
        }
        dispatch(setLoading(false));
    }
}

export const requestCompleteLesson = (userID, courseID, moduleID, lessonID, passed) => {
    return async (dispatch) => {
        dispatch(setLoading(true));
        try {
            const status = await CoursesAPI.completeLesson(userID, courseID, moduleID, lessonID, passed);
            if (status === 201)
                console.log('Lesson completed successfully');
            else
                console.error('Complete lesson error');
        }
        catch (error) {
            console.log('Complete lesson error', error);
        }
        dispatch(setLoading(false));
    }
}

//Получение модулей и уроков выбранного курса
export const requestCourseModules = (courseID, userID, modulePage, lessonPage, modulePageSize, lessonPageSize) => {
    return async (dispatch) => {
        dispatch(setLoading(true));
        try {
            const data = await CoursesAPI.getCourseModules(courseID, userID, modulePage, lessonPage, modulePageSize, lessonPageSize);
            dispatch(setModules(data.modules));
            dispatch(setLessons(data.lessons));
            dispatch(setModulesCount(data.modulesCount));
            dispatch(setLessonsCount(data.lessonsCount));
        }
        catch (error) {
            console.log('Get course content error', error);
        }
        dispatch(setLoading(false));
    }
}