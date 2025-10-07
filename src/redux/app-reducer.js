import { setUser } from "./auth-reducer";

const SET_INITIALIZED = 'SET-INITIALIZED';

const initialState = {
    initialized: false,
}

export const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_INITIALIZED:
            return {
                ...state,
                initialized: true
            }
        default:
            return state
    }
}

export const setInitialized = () => ({ type: SET_INITIALIZED })

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


