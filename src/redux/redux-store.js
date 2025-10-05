import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { coursesReducer } from "./courses-reducer";
import { authReducer } from "./auth-reducer";

const rootReducer = combineReducers({
    courses: coursesReducer,
    auth: authReducer,
});

const store = configureStore({
    reducer: rootReducer
});

export default store;