import webSocketService from "../service/webSocketService";
import { setUser } from "./auth-reducer";

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
        const storedUserData = localStorage.getItem('user');
        //Данные есть в localStorage -> загружаем в state
        if (storedUserData) {
            try {
                const userData = JSON.parse(storedUserData);  //Из строки в объект  
                await dispatch(setUser(userData));
            }
            catch (error) {
                console.error('Error parsing user data from localStorage', error);
                localStorage.removeItem('user');
            }
        }
        dispatch(setInitialized());
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


