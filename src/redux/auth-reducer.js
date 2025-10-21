import { AuthAPI } from "../service/api";
import { setNotify } from "./app-reducer.js";

const SET_USER = 'SET-USER';
const SET_LOADING = 'SET-LOADING';

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
    return (dispatch) => {
        dispatch(setLoading(true));
        AuthAPI.signUp(username, email, password)
            .then(data => {
                dispatch(setUser(data.user));
                localStorage.setItem('user', JSON.stringify(data.user));  //Из объекта в строку
                dispatch(setNotify({ status: 'success', message: 'The user was successfully created' }));
            })
            .catch(error => {
                console.log('Sign up error', error);
                dispatch(setNotify({ status: 'error', message: 'User creation error' }));
            })
            .finally(() => dispatch(setLoading(false)))
    }
}

export const logOut = () => {
    return (dispatch) => {
        localStorage.removeItem('user');
        dispatch(setUser(null));
    }
}

export const signIn = (username, password) => {
    return (dispatch) => {
        dispatch(setLoading(true))
        AuthAPI.signIn(username, password)
            .then(data => {
                dispatch(setUser(data.user));
                localStorage.setItem('user', JSON.stringify(data.user));  //Из объекта в строку
                dispatch(setNotify({ status: 'success', message: 'Successful login' }));

            })
            .catch(error => {
                console.log('Login error', error);
                dispatch(setNotify({ status: 'error', message: 'Login error' }));
            })
            .finally(() => dispatch(setLoading(false)))
    }
}


export const requestPasswordReset = (email) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        AuthAPI.requestReset(email)
            .then(status => {
                if (status === 200)
                    dispatch(setNotify({ status: 'success', message: 'The email was sent successfully' }));
                else
                    dispatch(setNotify({ status: 'error', message: 'Error sending email' }));

            })
            .catch(error => {
                console.log('Request reset error', error);
                dispatch(setNotify({ status: 'error', message: 'Error sending email' }));
            })
            .finally(() => dispatch(setLoading(false)));
    }
}

export const passwordReset = (resetToken, newPassword) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        AuthAPI.reset(resetToken, newPassword)
            .then(data => {
                dispatch(setUser(data.user));
                localStorage.setItem('user', JSON.stringify(data.user));  //Из объекта в строку
                dispatch(setNotify({ status: 'success', message: 'Password changed successfully' }));
            })
            .catch(error => {
                console.log('Request reset error', error);
                dispatch(setNotify({ status: 'error', message: 'Error changing password' }));
            })
            .finally(() => dispatch(setLoading(false)));
    }
}