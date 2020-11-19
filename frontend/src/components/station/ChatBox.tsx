import { HubConnection } from "@microsoft/signalr";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import IListenerDetail from "../../models/station/IListenerDetail";
import StationService from "../../services/StationService";
import { setStationUsers } from "../../store/connection-slice";
import { hubConnection } from "../../store/station-connection";
import { RootState } from "../../store/store";
interface Props {
	stationId: number;
	loaded: boolean;
}
function ChatBox(props: Props) {
	const [loaded, setLoaded] = useState(false);
	const listeners = useSelector(
		(state: RootState) => state.connectionReducier.usersInStation
	);
	const dispatch = useDispatch();
	useEffect(() => {
		if (props.loaded) {
			StationService.getStationListeners(props.stationId).then(
				(response) => {
					dispatch(setStationUsers(response.data));
					setLoaded(true);
				}
			);
		}
	}, [props.loaded]);

	return (
		<div>
			{loaded ? (
				<div>
					{listeners.map((item) => (
						<div key={item.userId}>{item.username}</div>
					))}
				</div>
			) : (
				<div>Connecting to chat...</div>
			)}
		</div>
	);
}

export default ChatBox;
