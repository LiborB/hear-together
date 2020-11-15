import Axios, { AxiosResponse } from "axios"
import IStationDetail from "../models/station/IStationDetail";
import IStationSimple from "../models/station/IStationSimple";
import IUpdateStation from "../models/station/IUpdateStation";

export default class StationService {
    private static readonly baseUrl = "station";
    static getStationDetail(stationId: number) {
        return Axios.get<IStationDetail>(`${this.baseUrl}/details/${stationId}`);
    }

    static updateStation(updateStation: IUpdateStation) {
        return Axios.post<void>(`${this.baseUrl}/update`, updateStation);
    }

    static createStation() {
        return Axios.post<number>(`${this.baseUrl}/create`);
    }

    static getAllStations() {
        return Axios.get<IStationSimple[]>(`${this.baseUrl}/getallstations`);
    }
}