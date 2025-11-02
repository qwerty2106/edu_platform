import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { coursesReducer } from "./courses-reducer";
import { authReducer } from "./auth-reducer";
import { appReducer } from "./app-reducer";
import { chatReducer } from "./chat-reducer";
import { roomsReducer } from "./rooms-reducer";
import { profileReducer } from "./profile-reducer";

const rootReducer = combineReducers({
    courses: coursesReducer,
    auth: authReducer,
    app: appReducer,
    rooms: roomsReducer,
    chat: chatReducer,
    profile: profileReducer
});

const store = configureStore({
    reducer: rootReducer
});

export default store;