import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./user-slice";

const rootReducer = combineReducers({
    userReducer: userSlice.reducer
})

export const store = configureStore({
    reducer: rootReducer
})

export type RootState = ReturnType<typeof rootReducer>

