import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { coursesReducer } from "./courses-reducer";
import { authReducer } from "./auth-reducer";
import { appReducer } from "./app-reducer";
import { chatReducer } from "./chat-reducer";

const rootReducer = combineReducers({
    courses: coursesReducer,
    auth: authReducer,
    app: appReducer,
    chat: chatReducer,
});

const store = configureStore({
    reducer: rootReducer
});

export default store;