import { ChatAPI } from "../service/api";
import webSocketService from "../service/webSocketService";

const SET_ROOMS = 'SET-ROOMS';
const SET_LOADING = "SET-LOADING";
const SET_ROOMS_STATS = 'SET-ROOMS-STATS';
const SET_MESSAGE_STATS = 'SET-MESSAGE-STATS';

const initialState = {
    rooms: [],
    isLoading: true,
    roomStats: null,
    messageStats: null
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
        case SET_ROOMS_STATS:
            return {
                ...state,
                roomStats: action.roomStats
            }
        case SET_MESSAGE_STATS:
            return {
                ...state,
                messageStats: action.messageStats
            }
        default:
            return state
    }
}

export const setRooms = (rooms) => ({ type: SET_ROOMS, rooms });
export const setLoading = (isLoading) => ({ type: SET_LOADING, isLoading });
export const setRoomStats = (roomStats) => ({ type: SET_ROOMS_STATS, roomStats });
export const setMessageStats = (messageStats) => ({ type: SET_MESSAGE_STATS, messageStats });


export const requestRooms = () => {
    return async (dispatch) => {
        dispatch(setLoading(true));
        const storedUserData = JSON.parse(localStorage.getItem('user')); //Из объекта в строку
        ChatAPI.getRooms(storedUserData.id)
            .then(data => dispatch(setRooms(data)))
            .catch(error => console.log('Get rooms error', error))
            .finally(() => dispatch(setLoading(false)));
    };
};


//Подписка на получение статистики по онлайн-пользователям
export const listenRoomStats = () => {
    return (dispatch) => {
        webSocketService.listenRoomStats((roomStats) => {
            dispatch(setRoomStats(roomStats));
        });
    };
};

//Подписка на получение статистики по сообщениям
export const listenMessageStats = () => {
    return (dispatch) => {
        webSocketService.listenMessageStats((messageStats) => {
            dispatch(setMessageStats(messageStats));
        });
    };
};



