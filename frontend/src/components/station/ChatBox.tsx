import { HubConnection } from "@microsoft/signalr";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "../../custom-elements";
import IListenerDetail from "../../models/station/IListenerDetail";
import IStationMessage from "../../models/station/IStationMessage";
import ChatService from "../../services/ChatService";
import SongService from "../../services/SongService";
import StationService from "../../services/StationService";
import { setStationMessages } from "../../store/chat-slice";
import { setStationUsers } from "../../store/connection-slice";
import { hubConnection } from "../../store/station-connection";
import { RootState } from "../../store/store";
import Moment from "react-moment";
import ScrollableFeed from "react-scrollable-feed";

interface Props {
	stationId: number;
	loaded: boolean;
}
function ChatBox(props: Props) {
	const [loaded, setLoaded] = useState(false);
	const listeners = useSelector(
		(state: RootState) => state.connectionReducier.usersInStation
	);
	const stationMessages = useSelector(
		(state: RootState) => state.chatReducer.stationMessages
	);
	const dispatch = useDispatch();
	const [commentValue, setCommentValue] = useState("");
	const scrollToDiv = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (props.loaded) {
			StationService.getStationListeners(props.stationId).then(
				(response) => {
					dispatch(setStationUsers(response.data));
					ChatService.getStationMessages(props.stationId).then(
						(response) => {
							dispatch(setStationMessages(response.data));
							setLoaded(true);
						}
					);
				}
			);
		}
		return () => {
			dispatch(setStationMessages([]));
		};
	}, [props.loaded]);

	function handleCommentValueChange(
		event: React.ChangeEvent<HTMLInputElement>
	) {
		setCommentValue(event.currentTarget.value);
	}

	function handleKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
		if (event.key === "Enter" && commentValue.length) {
			ChatService.addStationMessage(props.stationId, commentValue);
			setCommentValue("");
		}
	}

	return (
		<div className="chat-box-container">
			{loaded ? (
				<Fragment>
					<div className="flex flex-col h-9/10">
						<ScrollableFeed>
							{stationMessages.map((item) => (
								<div
									key={item.id}
									className="flex px-1 py-1 justify-between"
								>
									<div className="text-sm break-all">
										<span className="text-red-300">
											{item.username}
										</span>
										&nbsp;
										{item.message}
									</div>
									<div className="pl-1 flex-shrink-0">
										<Moment
											utc
											local
											className="text-xs text-gray-500"
											date={item.created}
											format="HH:mm MMM DD"
										></Moment>
									</div>
								</div>
							))}{" "}
						</ScrollableFeed>

						<div className="clear-both" ref={scrollToDiv}></div>
					</div>
					<div>
						<Input
							placeholder="Enter a comment..."
							value={commentValue}
							onChange={handleCommentValueChange}
							onKeyPress={handleKeyPress}
						></Input>
					</div>
				</Fragment>
			) : (
				<div>Connecting to chat...</div>
			)}
		</div>
	);
}

export default ChatBox;
