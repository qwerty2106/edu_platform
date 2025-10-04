import { CoursesAPI } from "../api/api";

const SET_COURSES = "SET-COURSES";
const initialState = {
    courses: null
}

export const coursesReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_COURSES:
            return {
                ...state,
                courses: action.courses
            }
        default:
            return state;
    }
}

export const setCourses = (courses) => ({ type: SET_COURSES, courses })

export const getCourses = () => {
    return (dispatch) => {
        CoursesAPI.getCourses()
            .then(data => dispatch(setCourses(data)))
            .catch(error => console.log('Get courses error', error))
    }
}