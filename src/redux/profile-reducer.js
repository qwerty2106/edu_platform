import { ProfileAPI } from "../service/api";

const SET_LOADING = "profile/SET-LOADING";
const SET_USER_PROGRESS = 'profile/SET-USER-PROGRESS';
const SET_CURRENT_PAGE = "profile/SET-CURRENT-PAGE"
const SET_USER_COURSES_COUNT = "profile/SET-USER-COURSES-COUNT"


const initialState = {
    userProgress: {
        statistics: [],
        activity: []
    },
    isLoading: true,
    currentPage: 1,
    coursesCount: 0,
}

export const profileReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER_PROGRESS:
            return {
                ...state,
                userProgress: action.userProgress
            }
        case SET_LOADING:
            return {
                ...state,
                isLoading: action.isLoading
            }
        case SET_CURRENT_PAGE:
            return {
                ...state,
                currentPage: action.currentPage
            }
        case SET_USER_COURSES_COUNT:
            return {
                ...state,
                coursesCount: action.coursesCount
            }
        default:
            return state
    }
}

export const setUserProgress = (userProgress) => ({ type: SET_USER_PROGRESS, userProgress });
export const setLoading = (isLoading) => ({ type: SET_LOADING, isLoading });
export const setCurrentPage = (currentPage) => ({ type: SET_CURRENT_PAGE, currentPage });
export const setUserCoursesCount = (coursesCount) => ({ type: SET_USER_COURSES_COUNT, coursesCount })

export const requestUserProgress = (userID, currentPage, pageSize) => {
    return async (dispatch) => {
        dispatch(setLoading(true));
        try {
            const data = await ProfileAPI.getUserProgress(userID, currentPage, pageSize);
            dispatch(setUserProgress(data));
            dispatch(setUserCoursesCount(data.totalCount));

        }
        catch (error) {
            console.log('Get users courses error', error);
        }
        dispatch(setLoading(false));
    };
};