import { useNavigate } from "react-router-dom";
import { WorksAPI } from "../service/api";
import { setNotify } from "./app-reducer";

const SET_WORKS = 'works/SET-WORKS';
const SET_CURRENT_WORK = 'works/SET-CURRENT-WORK';
const SET_LOADING = "rooms/SET-LOADING";
const SET_WORKS_COUNT = "rooms/SET-WORKS-COUNT";

const initialState = {
    works: [],
    isLoading: true,
    currentWork: {},
    worksCount: 0,
}

export const worksReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_WORKS:
            return {
                ...state,
                works: action.works
            }
        case SET_CURRENT_WORK:
            return {
                ...state,
                currentWork: action.currentWork
            }
        case SET_LOADING:
            return {
                ...state,
                isLoading: action.isLoading
            }
        case SET_WORKS_COUNT:
            return {
                ...state,
                worksCount: action.worksCount
            }
        default:
            return state
    }
}

export const setWorks = (works) => ({ type: SET_WORKS, works });
export const setCurrentWork = (currentWork) => ({ type: SET_CURRENT_WORK, currentWork });
export const setLoading = (isLoading) => ({ type: SET_LOADING, isLoading });
export const setWorksCount = (worksCount) => ({ type: SET_WORKS_COUNT, worksCount });


export const requestWorks = (userID, currentPage, pageSize) => {
    return async (dispatch) => {
        dispatch(setLoading(true));
        try {
            const data = await WorksAPI.getWorks(userID, currentPage, pageSize);
            dispatch(setWorks(data.works));
            dispatch(setWorksCount(data.worksCount));
            return { success: true };
        }
        catch (error) {
            console.log('Get works error', error);
            return { success: false, error: error.response.status }
        }
        finally {
            dispatch(setLoading(false));
        }
    };
};

export const requestCurrentWork = (userID, lessonID) => {
    return async (dispatch) => {
        dispatch(setLoading(true));
        try {
            const data = await WorksAPI.getCurrentWork(userID, lessonID);
            dispatch(setCurrentWork(data));
            return { success: true };
        }
        catch (error) {
            console.log('Get work error', error);
            return { success: false, error: error.response.status };
        }
        finally {
            dispatch(setLoading(false));
        }
    };
};

export const requestCheckWork = (userID, lessonID, newStatus, comment, score) => {
    return async (dispatch) => {
        dispatch(setLoading(true));
        try {
            await WorksAPI.updateWork(userID, lessonID, newStatus, comment, score);
            dispatch(requestCurrentWork(userID, lessonID));
            dispatch(setNotify({ status: 'success', message: 'Работа обновлена!' }));
        }
        catch (error) {
            console.log('Update work error', error);
            dispatch(setNotify({ status: 'error', message: 'Произошла ошибка!' }));
        }
        dispatch(setLoading(false));
    };
};