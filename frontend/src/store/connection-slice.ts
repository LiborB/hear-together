import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import IListenerDetail from "../models/station/IListenerDetail";


export interface ConnectionState {
    isConnected: boolean,
    usersInStation: IListenerDetail[]
}

export const connectionSlice = createSlice({
    name: "connection",
    initialState: {
        isConnected: false,
        usersInStation: []
    } as ConnectionState,
    reducers: {
        setIsConnected: (state, action: PayloadAction<boolean>) => {
            state.isConnected = action.payload;
        },
        addUserToStation: (state, action: PayloadAction<IListenerDetail>) => {
            state.usersInStation = [...state.usersInStation, action.payload];
        },
        removeUserFromStation: (state, action: PayloadAction<IListenerDetail>) => {
            state.usersInStation = state.usersInStation.filter(x => x.userId !== action.payload.userId);
        },
        setStationUsers: (state, action: PayloadAction<IListenerDetail[]>) => {
            state.usersInStation = [...action.payload];
        },
    }
})

export const {
    setIsConnected,
    addUserToStation,
    removeUserFromStation,
    setStationUsers
} = connectionSlice.actions