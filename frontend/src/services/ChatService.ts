import Axios from "axios";
import IStationMessage from "../models/station/IStationMessage";

export default class ChatService {
    private static readonly baseUrl = "chat";

    static getStationMessages(stationId: number) {
        return Axios.get<IStationMessage[]>(`${this.baseUrl}/stationmessages/${stationId}`);
    }

    static addStationMessage(stationId: number, message: string) {

        return Axios.post(`${this.baseUrl}/addmessage/${stationId}`, {
            message: message
        });
    }
}