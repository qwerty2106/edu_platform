import { AuthAPI } from "../api/api.js";

const SET_USER = 'SET-USER';
const SET_LOADING = 'SET-LOADING';
const SET_RESET_STATUS = 'SET-RESET-STATUS';
const SET_REQUEST_RESET_STATUS = 'SET-REQUEST-RESET-STATUS';
const SET_SIGN_IN_STATUS = 'SET-SIGN-IN-STATUS';
const SET_SIGN_UP_STATUS = 'SET-SIGN-IN-STATUS';

const initialState = {
    user: null,
    isLoading: false,
    requestResetStatus: {},

    //Notify
    resetStatus: {},
    signInStatus: {},
    signUpStatus: {},
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
        case SET_REQUEST_RESET_STATUS:
            return {
                ...state,
                requestResetStatus: action.requestResetStatus
            }

        //Notify
        case SET_RESET_STATUS:
            return {
                ...state,
                resetStatus: action.resetStatus
            }
        case SET_SIGN_IN_STATUS:
            return {
                ...state,
                signInStatus: action.signInStatus
            }
        case SET_SIGN_UP_STATUS:
            return {
                ...state,
                signUpStatus: action.signUpStatus
            }
        default:
            return state
    }
}

export const setUser = (user) => ({ type: SET_USER, user });
export const setLoading = (isLoading) => ({ type: SET_LOADING, isLoading });
export const setRequestResetStatus = (requestResetStatus) => ({ type: SET_REQUEST_RESET_STATUS, requestResetStatus });

//Notify
export const setResetStatus = (resetStatus) => ({ type: SET_RESET_STATUS, resetStatus });
export const setSignInStatus = (signInStatus) => ({ type: SET_SIGN_IN_STATUS, signInStatus });
export const setSignUpStatus = (setSignUpStatus) => ({ type: SET_SIGN_UP_STATUS, setSignUpStatus })

export const signUp = (username, email, password) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        AuthAPI.signUp(username, email, password)
            .then(data => {
                dispatch(setUser(data.user));
                localStorage.setItem('user', JSON.stringify(data.user));  //Из объекта в строку
                dispatch(setSignInStatus({ status: 'success', message: 'The user was successfully created' }));
            })
            .catch(error => {
                console.log('Sign up error', error);
                dispatch(setSignInStatus({ status: 'error', message: 'User creation error' }));
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
                dispatch(setSignInStatus({ status: 'success', message: 'Successful login' }));

            })
            .catch(error => {
                console.log('Login error', error);
                dispatch(setSignInStatus({ status: 'error', message: 'Login error' }));
            })
            .finally(() => dispatch(setLoading(false)))
    }
}


export const requestPasswordReset = (email) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        dispatch(setRequestResetStatus({ status: 'info', message: 'The email is being sent...' }));
        AuthAPI.requestReset(email)
            .then(status => {
                if (status === 200)
                    dispatch(setRequestResetStatus({ status: 'success', message: 'The email was sent successfully' }));
                else
                    dispatch(setRequestResetStatus({ status: 'error', message: 'Error sending email' }));

            })
            .catch(error => {
                console.log('Request reset error', error);
                dispatch(setRequestResetStatus('error'));
            })
            .finally(() => dispatch(setLoading(false)));
    }
}

export const passwordReset = (resetToken, newPassword) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        dispatch(setResetStatus({ status: 'info', message: 'The password is being changed...' }));
        AuthAPI.reset(resetToken, newPassword)
            .then(data => {
                dispatch(setUser(data.user));
                localStorage.setItem('user', JSON.stringify(data.user));  //Из объекта в строку
                dispatch(setResetStatus({ status: 'success', message: 'Password changed successfully' }));
            })
            .catch(error => {
                console.log('Request reset error', error);
                dispatch(setResetStatus({ status: 'error', message: 'Error changing password' }));
            })
            .finally(() => dispatch(setLoading(false)));
    }
}