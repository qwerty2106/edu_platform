import { ChatAPI } from "../api/api"

const SET_MESSAGES = 'SET-MESSAGES'
const SET_LOADING = "SET-LOADING";

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

export const setMessages = (messages) => ({ type: SET_MESSAGES, messages });
export const setLoading = (isLoading) => ({ type: SET_LOADING, isLoading });

export const requestMessages = (chatID) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        ChatAPI.getMessages(chatID)
            .then(data => dispatch(setMessages(data)))
            .catch(error => console.log('Get messages error', error))
            .finally(() => dispatch(setLoading(false)))
    }
}


