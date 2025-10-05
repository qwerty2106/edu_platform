import { AuthAPI } from "../api/api.js"

const SET_USER = 'SET-USER'
const initialState = {
    user: {},
}

export const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER:
            return {
                ...state,
                user: action.user,
            }
        default:
            return state
    }
}

export const setUser = (user) => ({ type: SET_USER, user })

export const signUp = (username, password) => {
    return (dispatch) => {
        AuthAPI.signUp(username, password)
            .then(data => dispatch(setUser(data.user)))
            .catch(error => console.log('Sign up error', error))
    }
}

export const signIn = (username, password) => {
    return (dispatch) => {
        AuthAPI.signIn(username, password)
            .then(data => dispatch(setUser(data.user)))
            .catch(error => console.log('Sign in error', error))
    }
}

