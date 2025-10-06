import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { coursesReducer } from "./courses-reducer";
import { authReducer } from "./auth-reducer";
import { appReducer } from "./app-reducer";

const rootReducer = combineReducers({
    courses: coursesReducer,
    auth: authReducer,
    app: appReducer,
});

const store = configureStore({
    reducer: rootReducer
});

export default store;