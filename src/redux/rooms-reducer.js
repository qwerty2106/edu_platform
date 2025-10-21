import { ChatAPI } from "../service/api";

const SET_ROOMS = 'SET-ROOMS';
const SET_LOADING = "SET-LOADING";

const initialState = {
    rooms: [],
    isLoading: true,
}

export const roomsReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_ROOMS:
            return {
                ...state,
                rooms: action.rooms
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

export const setRooms = (rooms) => ({ type: SET_ROOMS, rooms });
export const setLoading = (isLoading) => ({ type: SET_LOADING, isLoading });


export const requestRooms = () => {
    return async (dispatch) => {
        dispatch(setLoading(true));
        const storedUserData = JSON.parse(localStorage.getItem('user')); //Из объекта в строку
        ChatAPI.getRooms(storedUserData.id)
            .then(data => dispatch(setRooms(data)))
            .catch(error => console.log('Get rooms error', error))
            .finally(() => dispatch(setLoading(false)))
    }
}


