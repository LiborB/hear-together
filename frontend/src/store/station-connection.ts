import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { hubUrl } from "..";
import IListenerDetail from "../models/station/IListenerDetail";
import { addUserToStation, removeUserFromStation, setIsConnected } from "./connection-slice";
import { store } from "./store";

export let hubConnection: HubConnection;
export function startConnection(url: string) {
    hubConnection = new HubConnectionBuilder()
        .withUrl(url)
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
}





