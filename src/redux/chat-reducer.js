import { ChatAPI } from "../service/api"
import webSocketService from "../service/webSocketService";

const SET_MESSAGES = 'chat/SET-MESSAGES'
const SET_LOADING = "chat/SET-LOADING";
const ADD_MESSAGE = 'chat/ADD-MESSAGE';

const initialState = {
    messages: [],
    isLoading: true,
}

export const chatReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_MESSAGES:
            return {
                ...state,
                messages: action.messages
            };
        case SET_LOADING:
            return {
                ...state,
                isLoading: action.isLoading
            };
        case ADD_MESSAGE:
            return {
                ...state,
                messages: [...state.messages, { ...action.message }],
            };
        default:
            return state
    }
}

export const setMessages = (messages) => ({ type: SET_MESSAGES, messages });
export const setLoading = (isLoading) => ({ type: SET_LOADING, isLoading });
export const addMessage = (message) => ({ type: ADD_MESSAGE, message });

export const requestMessages = (chatID) => {
    return async (dispatch) => {
        dispatch(setLoading(true));
        try {
            const data = await ChatAPI.getMessages(chatID);
            dispatch(setMessages(data));
        }
        catch (error) {
            console.log('Get messages error', error);
        }
        dispatch(setLoading(false));
    };
};

//Отправка подключенного пользователя
export const joinUser = (username, chatID) => {
    return (dispatch) => {
        webSocketService.joinUser(username, chatID);
    };
};

//Отправка отключенного пользователя
export const leaveUser = (username, chatID) => {
    return (dispatch) => {
        webSocketService.leaveUser(username, chatID);
    };
};

//Отправка сообщения
export const sendMessage = (message, username, chatID) => {
    return (dispatch) => {
        webSocketService.sendMessage(message, username, chatID);
    };
};

//Подписка на получение сообщений
export const listenReceiveMessage = () => {
    return (dispatch) => {
        webSocketService.listenReceiveMessage((data) => {
            dispatch(addMessage(data));
        })
    };
};

