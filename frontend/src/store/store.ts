import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { chatSlice } from "./chat-slice";
import { connectionSlice } from "./connection-slice";
import { userSlice } from "./user-slice";

const rootReducer = combineReducers({
    userReducer: userSlice.reducer,
    connectionReducier: connectionSlice.reducer,
    chatReducer: chatSlice.reducer
})

export const store = configureStore({
    reducer: rootReducer
})

export type RootState = ReturnType<typeof rootReducer>

