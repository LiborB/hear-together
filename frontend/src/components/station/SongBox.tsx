import React, { useEffect, useRef, useState } from "react";
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
	const songRef = useRef<ReactHowler>(null);
	const [songDuration, setSongDuration] = useState(0);

	useEffect(() => {
		SongService.getCurrentPlayingSong(props.stationId).then((response) => {
			SongService.getQueuedSongs(props.stationId).then((response) => {
				dispatch(setQueuedSongs(response.data));
			});
			dispatch(playSong(response.data));
		});
		setInterval(() => {
			if (songRef.current) {
				setSongDuration(songRef.current.seek());
			}
		}, 1000);
	}, []);

	function skipClick() {
		hubConnection.send("FinishSong", songPlaying.id, props.stationId);
	}

	function handleSongFinish() {
		hubConnection.send("FinishSong", songPlaying.id, props.stationId);
	}

	return (
		<div>
			<div>
				{songPlaying?.id > 0 && (
					<ReactHowler
						ref={songRef}
						html5
						playing
						src={songPlaying.songBase64}
						onEnd={handleSongFinish}
					></ReactHowler>
				)}
				current song: {songPlaying?.title}
				{}
				<button onClick={skipClick}>skip</button>
			</div>
			{songsInQueue.map((song) => (
				<div key={song.id}>
					{song.title} - {song.id}
				</div>
			))}
			<div>
				{songDuration} / {songRef.current?.duration()}
			</div>
		</div>
	);
}
