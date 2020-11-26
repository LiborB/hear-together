import React, { Fragment, useEffect, useRef, useState } from "react";
import ReactHowler from "react-howler";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../../custom-elements";
import SongService from "../../services/SongService";
import StationService from "../../services/StationService";
import { playSong, setQueuedSongs } from "../../store/connection-slice";
import { hubConnection } from "../../store/station-connection";
import { RootState } from "../../store/store";
import Moment from "react-moment";

interface Props {
	stationId: number;
	isUserOwner: boolean;
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
		<div className="song-box-container">
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
				<div className="px-2">
					<div className="flex justify-between text-teal-300 py-2">
						{songPlaying?.id > 0 ? (
							<Fragment>
								<div className="flex items-center">
									<span className="pr-2">
										{songPlaying?.title}
									</span>
									<div className="loader mt-1"></div>
								</div>

								{props.isUserOwner && (
									<button
										className="skip-button"
										onClick={skipClick}
									>
										Skip
									</button>
								)}
							</Fragment>
						) : (
							<div>No song playing</div>
						)}
					</div>
					{songsInQueue.map((song) => (
						<div
							key={song.id}
							className="flex items-center justify-between py-2"
						>
							<span className="pr-2">{song.title}</span>
							<Moment
								utc
								date={song.duration * 1000}
								format="mm:ss"
							></Moment>
						</div>
					))}
				</div>
			</div>

			<div>
				{songDuration} / {songRef.current?.duration()}
			</div>
		</div>
	);
}
