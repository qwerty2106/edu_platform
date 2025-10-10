import { CoursesAPI } from "../api/api";

const SET_COURSES = "SET-COURSES";
const SET_MODULES = "SET-MODULES";
const SET_LESSONS = "SET-LESSONS";
const SET_LOADING = "SET-LOADING";

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
    return (dispatch) => {
        dispatch(setLoading(true));
        CoursesAPI.getCourses()
            .then(data => dispatch(setCourses(data)))
            .catch(error => console.log('Get courses error', error))
            .finally(() => dispatch(setLoading(false)))
    }
}

//Получение модулей и уроков выбранного курса
export const requestCourseModules = (courseID) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        CoursesAPI.getCourseModules(courseID)
            .then(data => {
                dispatch(setModules(data.modules));
                dispatch(setLessons(data.lessons));
            })
            .catch(error => console.log('Get course content error', error))
            .finally(() => dispatch(setLoading(false)))
    }
}