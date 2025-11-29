import { AuthAPI } from "../service/api";
import { setNotify } from "./app-reducer.js";

const SET_USER = 'auth/SET-USER';
const SET_ACCESS_TOKEN = 'auth/SET-ACCESS-TOKEN';
const SET_LOADING = 'auth/SET-LOADING';

const initialState = {
    user: null,
    isLoading: false,
    accessToken: null,
}

export const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER:
            return {
                ...state,
                user: action.user
            }
        case SET_LOADING:
            return {
                ...state,
                isLoading: action.isLoading
            }
        case SET_ACCESS_TOKEN:
            return {
                ...state,
                accessToken: action.accessToken
            }
        default:
            return state
    }
}

export const setUser = (user) => ({ type: SET_USER, user });
export const setAccessToken = (accessToken) => ({ type: SET_ACCESS_TOKEN, accessToken });
export const setLoading = (isLoading) => ({ type: SET_LOADING, isLoading });

//Регистрация
export const signUp = (username, email, password) => {
    return async (dispatch) => {
        dispatch(setLoading(true));
        try {
            const data = await AuthAPI.signUp(username, email, password);
            dispatch(setUser(data.user));
            dispatch(setAccessToken(data.accessToken));
            dispatch(setNotify({ status: 'success', message: 'Успешный вход!' }));
        }
        catch (error) {
            console.log('Sign up error', error);
            dispatch(setNotify({ status: 'error', message: 'Ошибка создания аккаунта!' }));
        }
        dispatch(setLoading(false));
    }
}

export const logOut = () => {
    return async (dispatch) => {
        try {
            await AuthAPI.logOut();
        }
        catch (error) {
            console.log('Logout error', error);
        }
        finally {
            dispatch(setAccessToken(null));
            dispatch(setUser(null));
        }
    }
}

//Авторизация
export const signIn = (username, password) => {
    return async (dispatch) => {
        dispatch(setLoading(true));
        try {
            const data = await AuthAPI.signIn(username, password);
            console.log(data.user)
            dispatch(setUser(data.user));
            dispatch(setAccessToken(data.accessToken));
            dispatch(setNotify({ status: 'success', message: 'Успешный вход!' }));
        }
        catch (error) {
            console.log('Login error', error);
            dispatch(setNotify({ status: 'error', message: 'Неверные данные!' }));
        }
        dispatch(setLoading(false));
    }
}

export const requestPasswordReset = (email) => {
    return async (dispatch) => {
        dispatch(setLoading(true));
        try {
            const status = await AuthAPI.requestReset(email);
            if (status === 200)
                dispatch(setNotify({ status: 'success', message: 'The email was sent successfully' }));
            else
                dispatch(setNotify({ status: 'error', message: 'Error sending email' }));
        }
        catch (error) {
            console.log('Request reset error', error);
            dispatch(setNotify({ status: 'error', message: 'Error sending email' }));
        }
        dispatch(setLoading(false));
    }
}

export const passwordReset = (resetToken, newPassword) => {
    return async (dispatch) => {
        dispatch(setLoading(true));
        try {
            const data = await AuthAPI.reset(resetToken, newPassword);
            dispatch(setUser(data.user));
            dispatch(setAccessToken(data.accessToken));
            dispatch(setNotify({ status: 'success', message: 'Password changed successfully' }));
        }
        catch (error) {
            console.log('Request reset error', error);
            dispatch(setNotify({ status: 'error', message: 'Error changing password' }));
        }
        dispatch(setLoading(false));
    }
}

