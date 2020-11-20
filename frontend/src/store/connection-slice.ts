import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IPlayingSong } from "../models/song/IPlayingSong";
import { IQueuedSong } from "../models/song/IQueuedSong";
import ISongDetail from "../models/song/ISongDetail";
import IListenerDetail from "../models/station/IListenerDetail";


export interface ConnectionState {
    isConnected: boolean,
    usersInStation: IListenerDetail[],
    songPlaying: IPlayingSong,
    songsInQueue: IQueuedSong[]
}

export const connectionSlice = createSlice({
    name: "connection",
    initialState: {
        isConnected: false,
        usersInStation: [],
        songPlaying: {} as IPlayingSong,
        songsInQueue: []
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
        addSongToQueue: (state, action: PayloadAction<IQueuedSong>) => {
            state.songsInQueue = [...state.songsInQueue, action.payload]
        },
        removeSongFromQueue: (state, action: PayloadAction<number>) => {
            state.songsInQueue = state.songsInQueue.filter(x => x.id !== action.payload)
        },
        playSong: (state, action: PayloadAction<IPlayingSong>) => {
            state.songPlaying = { ...action.payload };
        },
        setQueuedSongs: (state, action: PayloadAction<IQueuedSong[]>) => {
            state.songsInQueue = [...action.payload]
        }
    }
})

export const {
    setIsConnected,
    addUserToStation,
    removeUserFromStation,
    setStationUsers,
    addSongToQueue,
    playSong,
    removeSongFromQueue,
    setQueuedSongs
} = connectionSlice.actions