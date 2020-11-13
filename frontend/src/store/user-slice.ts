import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { act } from "react-dom/test-utils";
import { IUser } from "../models/IUser";

export interface UserState {
    isLoggedIn: boolean | undefined,
    currentUser: IUser
}

export const userSlice = createSlice({
    name: "user",
    initialState: {
        isLoggedIn: undefined,
        currentUser: {} as IUser
    } as UserState,
    reducers: {
        setCurrentUser: (state, action: PayloadAction<IUser>) => {
            state.currentUser = { ...action.payload }
        },
        setIsLoggedIn: (state, action: PayloadAction<boolean>) => {
            state.isLoggedIn = action.payload;
        }
    }
})

export const {
    setCurrentUser,
    setIsLoggedIn
} = userSlice.actions