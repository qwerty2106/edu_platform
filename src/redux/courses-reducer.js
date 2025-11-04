import { CoursesAPI } from "../service/api";

const SET_COURSES = "courses/SET-COURSES";
const SET_MODULES = "courses/SET-MODULES";
const SET_LESSONS = "courses/SET-LESSONS";
const SET_LOADING = "courses/SET-LOADING";

const initialState = {
    courses: [],
    modules: [],
    lessons: [],
    isLoading: true,
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
        default:
            return state;
    }
}

export const setCourses = (courses) => ({ type: SET_COURSES, courses })
export const setModules = (modules) => ({ type: SET_MODULES, modules })
export const setLessons = (lessons) => ({ type: SET_LESSONS, lessons })
export const setLoading = (isLoading) => ({ type: SET_LOADING, isLoading })

export const requestCourses = () => {
    return async (dispatch) => {
        dispatch(setLoading(true));
        try {
            const data = await CoursesAPI.getCourses();
            dispatch(setCourses(data));
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
export const requestCourseModules = (courseID, userID) => {
    return async (dispatch) => {
        dispatch(setLoading(true));
        try {
            const data = await CoursesAPI.getCourseModules(courseID, userID);
            dispatch(setModules(data.modules));
            dispatch(setLessons(data.lessons));
        }
        catch (error) {
            console.log('Get course content error', error);
        }
        dispatch(setLoading(false));
    }
}