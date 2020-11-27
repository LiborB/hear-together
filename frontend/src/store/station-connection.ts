import { HttpTransportType, HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { hubUrl } from "..";
import { IPlayingSong } from "../models/song/IPlayingSong";
import { IQueuedSong } from "../models/song/IQueuedSong";
import ISongDetail from "../models/song/ISongDetail";
import IListenerDetail from "../models/station/IListenerDetail";
import IStationMessage from "../models/station/IStationMessage";
import { addStationMessage } from "./chat-slice";
import { addSongToQueue, addUserToStation, playSong, removeSongFromQueue, removeUserFromStation, setIsConnected } from "./connection-slice";
import { store } from "./store";

export let hubConnection: HubConnection;
export function startConnection(url: string) {
    hubConnection = new HubConnectionBuilder()
        .withUrl(url, {
            skipNegotiation: true,
            transport: HttpTransportType.WebSockets
        })
        .configureLogging(LogLevel.Information)
        .build();
    hubConnection.start().then(() => {
        store.dispatch(setIsConnected(true));
    });

    hubConnection.on("UserLeaveStation", (listenerDetail: IListenerDetail) => {
        store.dispatch(removeUserFromStation(listenerDetail));
    })

    hubConnection.on("UserJoinStation", (listenerDetail: IListenerDetail) => {
        store.dispatch(addUserToStation(listenerDetail));
    })

    hubConnection.on("SongAddedToQueue", (song: IQueuedSong) => {
        store.dispatch(addSongToQueue(song));
    })
    hubConnection.on("SongRemovedFromQueue", (songId: number) => {
        store.dispatch(removeSongFromQueue(songId));
    })
    hubConnection.on("PlaySong", (song: IPlayingSong) => {
        store.dispatch(playSong(song));
    });

    hubConnection.on("StationMessageReceived", (stationMessage: IStationMessage) => {
        store.dispatch(addStationMessage(stationMessage));
    })

}





