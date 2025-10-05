import { AuthAPI } from "../api/api.js"

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

export const setUser = (user) => ({ type: SET_USER, user })
export const setLoading = (isLoading) => ({ type: SET_LOADING, isLoading })

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

