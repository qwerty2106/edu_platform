import { useSelector } from "react-redux";
import { AuthAPI } from "../service/api";
import webSocketService from "../service/webSocketService";
import { setAccessToken, setUser } from "./auth-reducer";
import { getAccessToken } from "./auth-selectors";

const SET_INITIALIZED = 'SET-INITIALIZED';
const SET_NOTIFY = 'SET-NOTIFY';

const initialState = {
    initialized: false,
    notify: {},
}

export const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_INITIALIZED:
            return {
                ...state,
                initialized: true
            }
        case SET_NOTIFY:
            return {
                ...state,
                notify: action.notify
            }
        default:
            return state
    }
}

export const setInitialized = () => ({ type: SET_INITIALIZED });
export const setNotify = (notify) => ({ type: SET_NOTIFY, notify });

//Инициализация на каждом обновлении
export const initializeApp = () => {
    return async (dispatch) => {
        try {
            const tokenData = await AuthAPI.refreshToken();
            dispatch(setAccessToken(tokenData.accessToken));

            const userData = await AuthAPI.getUserData(tokenData.accessToken);
            dispatch(setUser(userData));
        }
        catch (error) {
            console.error('Auto-login failed', error);
        }
        finally {
            dispatch(setInitialized());
        }
    }
}

//Подписка на получение уведомлений о сообщениях
export const listenNotify = () => {
    return (dispatch) => {
        webSocketService.listenNotify((data) => {
            dispatch(setNotify({ status: data.status, message: data.message }));
        })
    }
}


