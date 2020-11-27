import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import IStationMessage from "../models/station/IStationMessage";

export interface ChatState {
    stationMessages: IStationMessage[];
}

export const chatSlice = createSlice({
    name: "chat",
    initialState: {
        stationMessages: []
    } as ChatState,
    reducers: {
        setStationMessages: (state, action: PayloadAction<IStationMessage[]>) => {
            state.stationMessages = [...action.payload];
        },
        addStationMessage: (state, action: PayloadAction<IStationMessage>) => {
            state.stationMessages = [...state.stationMessages, action.payload];
        }
    }
})

export const {
    setStationMessages,
    addStationMessage
} = chatSlice.actions