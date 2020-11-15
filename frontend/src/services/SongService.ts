import Axios from "axios";
import { stat } from "fs";
import { type } from "os";
import IAddUrlSong from "../models/song/IAddUrlSong";
import ISongDetail from "../models/song/ISongDetail";

export default class SongService {
    static readonly baseUrl = "song";

    static addSongByUrl(addSong: IAddUrlSong) {
        return Axios.post<ISongDetail>(`${this.baseUrl}/addbyurl`, addSong);
    }
}