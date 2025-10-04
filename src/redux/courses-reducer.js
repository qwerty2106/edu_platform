import { CoursesAPI } from "../api/api";

const SET_COURSES = "SET-COURSES";
const SET_MODULES = "SET-MODULES";
const SET_LESSONS = "SET-LESSONS";

const initialState = {
    courses: null,
    modules: null,
    lessons: null
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
        default:
            return state;
    }
}

export const setCourses = (courses) => ({ type: SET_COURSES, courses })
export const setModules = (modules) => ({ type: SET_MODULES, modules })
export const setLessons = (lessons) => ({ type: SET_LESSONS, lessons })

export const getCoursesData = () => {
    return (dispatch) => {
        CoursesAPI.getCourses()
            .then(data => dispatch(setCourses(data)))
            .catch(error => console.log('Get courses error', error))
    }
}

//Получение модулей и уроков курса
export const getCourseContentData = (courseID) => {
    return (dispatch) => {
        CoursesAPI.getCourseContent(courseID)
            .then(data => {
                dispatch(setModules(data.modules));
                dispatch(setLessons(data.lessons))
            })
            .catch(error => console.log('Get course content error', error))
    }
}