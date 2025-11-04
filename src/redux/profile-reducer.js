import { ProfileAPI } from "../service/api";

const SET_LOADING = "profile/SET-LOADING";
const SET_USER_PROGRESS = 'profile/SET-USER-PROGRESS';

const initialState = {
    userProgress: {
        statistics: [],
        activity: []
    },
    isLoading: true,
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
        default:
            return state
    }
}

export const setUserProgress = (userProgress) => ({ type: SET_USER_PROGRESS, userProgress });
export const setLoading = (isLoading) => ({ type: SET_LOADING, isLoading });

export const requestUserProgress = (userID) => {
    return async (dispatch) => {
        dispatch(setLoading(true));
        try {
            const data = await ProfileAPI.getUserProgress(userID);
            dispatch(setUserProgress(data));
        }
        catch (error) {
            console.log('Get users courses error', error);
        }
        dispatch(setLoading(false));
    };
};