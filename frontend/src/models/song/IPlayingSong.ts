export interface IPlayingSong {
    id: number;
    title: string;
    duration: number;
    songBase64: string;
    currentSongPosition: number;
}