import { AuthAPI } from "../api/api.js";

const SET_USER = 'SET-USER';
const SET_LOADING = 'SET-LOADING';
const SET_RESET_STATUS = 'SET-RESET-STATUS';

const initialState = {
    user: null,
    isLoading: false,
    resetStatus: null
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
        case SET_RESET_STATUS:
            return {
                ...state,
                resetStatus: action.resetStatus
            }
        default:
            return state
    }
}

export const setUser = (user) => ({ type: SET_USER, user })
export const setLoading = (isLoading) => ({ type: SET_LOADING, isLoading })
export const setResetStatus = (resetStatus) => ({ type: SET_RESET_STATUS, resetStatus })

export const signUp = (username, password) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        AuthAPI.signUp(username, password)
            .then(data => {
                dispatch(setUser(data.user));
                localStorage.setItem('user', JSON.stringify(data.user));  //Из объекта в строку
            })
            .catch(error => console.log('Sign up error', error))
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

            })
            .catch(error => console.log('Sign in error', error))
            .finally(() => dispatch(setLoading(false)))
    }
}



export const requestPasswordReset = (email) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        dispatch(setResetStatus('pending'))
        AuthAPI.requestReset(email)
            .then(data => {
                dispatch(setResetStatus('success'))

            })
            .catch(error => {
                console.log('Request reset error', error)
                dispatch(setResetStatus('error'))

            })
            .finally(() => dispatch(setLoading(false)))
    }
}

export const passwordReset = (email) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        dispatch(setResetStatus('pending'));
        AuthAPI.reset(email)
            .then(data => {
                dispatch(setResetStatus('success'));

            })
            .catch(error => {
                console.log('Request reset error', error);
                dispatch(setResetStatus('error'));

            })
            .finally(() => dispatch(setLoading(false)))
    }
}