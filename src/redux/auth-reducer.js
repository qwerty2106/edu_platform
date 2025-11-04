import { AuthAPI } from "../service/api";
import { setNotify } from "./app-reducer.js";

const SET_USER = 'auth/SET-USER';
const SET_LOADING = 'auth/SET-LOADING';

const initialState = {
    user: null,
    isLoading: false,
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
        default:
            return state
    }
}

export const setUser = (user) => ({ type: SET_USER, user });
export const setLoading = (isLoading) => ({ type: SET_LOADING, isLoading });

export const signUp = (username, email, password) => {
    return async (dispatch) => {
        dispatch(setLoading(true));
        try {
            const data = await AuthAPI.signUp(username, email, password);
            dispatch(setUser(data.user));
            localStorage.setItem('user', JSON.stringify(data.user));  //Из объекта в строку
            dispatch(setNotify({ status: 'success', message: 'The user was successfully created' }));
        }
        catch (error) {
            console.log('Sign up error', error);
            dispatch(setNotify({ status: 'error', message: 'User creation error' }));
        }
        dispatch(setLoading(false));
    }
}

export const logOut = () => {
    return (dispatch) => {
        localStorage.removeItem('user');
        dispatch(setUser(null));
    }
}

export const signIn = (username, password) => {
    return async (dispatch) => {
        dispatch(setLoading(true));
        try {
            const data = AuthAPI.signIn(username, password);
            dispatch(setUser(data.user));
            localStorage.setItem('user', JSON.stringify(data.user));  //Из объекта в строку
            dispatch(setNotify({ status: 'success', message: 'Successful login' }));
        }
        catch (error) {
            console.log('Login error', error);
            dispatch(setNotify({ status: 'error', message: 'Login error' }));
        }
        dispatch(setLoading(false));
    }
}


export const requestPasswordReset = (email) => {
    return async (dispatch) => {
        dispatch(setLoading(true));
        try {
            const status = AuthAPI.requestReset(email);
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
            const data = AuthAPI.reset(resetToken, newPassword);
            dispatch(setUser(data.user));
            localStorage.setItem('user', JSON.stringify(data.user));  //Из объекта в строку
            dispatch(setNotify({ status: 'success', message: 'Password changed successfully' }));
        }
        catch (error) {
            console.log('Request reset error', error);
            dispatch(setNotify({ status: 'error', message: 'Error changing password' }));
        }
        dispatch(setLoading(false));
    }
}