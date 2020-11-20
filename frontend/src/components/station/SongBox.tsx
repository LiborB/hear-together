import React, { useEffect } from "react";
import ReactHowler from "react-howler";
import { useDispatch, useSelector } from "react-redux";
import SongService from "../../services/SongService";
import StationService from "../../services/StationService";
import { playSong, setQueuedSongs } from "../../store/connection-slice";
import { hubConnection } from "../../store/station-connection";
import { RootState } from "../../store/store";

interface Props {
	stationId: number;
}
export default function SongBox(props: Props) {
	const { songPlaying, songsInQueue } = useSelector(
		(state: RootState) => state.connectionReducier
	);
	const dispatch = useDispatch();

	useEffect(() => {
		SongService.getCurrentPlayingSong(props.stationId).then((response) => {
			SongService.getQueuedSongs(props.stationId).then((response) => {
				dispatch(setQueuedSongs(response.data));
			});
			dispatch(playSong(response.data));
		});
	}, []);

	function skipClick() {
		hubConnection.send("FinishSong", songPlaying.id, props.stationId);
	}

	useEffect(() => {
		if (songPlaying?.id > 0) {
			console.log("====================================");
			console.log(songPlaying.songBase64);
			console.log("====================================");
		}
	}, [songPlaying]);
	return (
		<div>
			<div>
				{songPlaying?.id > 0 && (
					<ReactHowler
						html5
						playing
						src={songPlaying.songBase64}
					></ReactHowler>
				)}
				current song: {songPlaying?.title}
				<button onClick={skipClick}>skip</button>
			</div>
			{songsInQueue.map((song) => (
				<div key={song.id}>
					{song.title} - {song.id}
				</div>
			))}
		</div>
	);
}
