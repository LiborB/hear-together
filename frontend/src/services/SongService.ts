import Axios from "axios";
import { stat } from "fs";
import { type } from "os";
import IAddUrlSong from "../models/song/IAddUrlSong";
import { IPlayingSong } from "../models/song/IPlayingSong";
import { IQueuedSong } from "../models/song/IQueuedSong";
import ISongDetail from "../models/song/ISongDetail";

export default class SongService {
    static readonly baseUrl = "song";

    static addSongByUrl(addSong: IAddUrlSong) {
        return Axios.post(`${this.baseUrl}/addbyurl`, addSong);
    }
    static getCurrentPlayingSong(stationId: number) {
        return Axios.get<IPlayingSong>(`${this.baseUrl}/getplayingsong/${stationId}`)
    }
    static getQueuedSongs(stationId: number) {
        return Axios.get<IQueuedSong[]>(`${this.baseUrl}/getqueuedsongs/${stationId}`)
    }
}