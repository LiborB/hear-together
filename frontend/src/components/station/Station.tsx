import Axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
	Button,
	Input,
	IResponseMessage,
	ResponseMessage,
} from "../../custom-elements";
import IStationDetail from "../../models/station/IStationDetail";
import StationService from "../../services/StationService";
import SearchBar from "./SearchBar";
import SongBox from "./SongBox";
import * as signalR from "@microsoft/signalr";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import ChatBox from "./ChatBox";
import IListenerDetail from "../../models/station/IListenerDetail";
import { hubConnection } from "../../store/station-connection";

interface RouteParams {
	stationId: string;
}
function Station() {
	const { stationId } = useParams<RouteParams>();
	const { currentUser } = useSelector(
		(state: RootState) => state.userReducer
	);
	const [stationDetail, setStationDetail] = useState<IStationDetail>(
		{} as IStationDetail
	);
	const [stationName, setStationName] = useState("");
	const [stationPrivate, setStationPrivate] = useState(false);
	const [responseMessage, setResponseMessage] = useState(
		{} as IResponseMessage
	);
	const [loaded, setLoaded] = useState(false);
	const { isConnected } = useSelector(
		(state: RootState) => state.connectionReducier
	);
	useEffect(() => {
		StationService.getStationDetail(+stationId).then((response) => {
			setStationDetail(response.data);
			setStationName(response.data.name);
			setStationPrivate(response.data.private);
		});
	}, []);
	useEffect(() => {
		if (isConnected) {
			hubConnection
				.invoke(
					"JoinStationRoom",
					{
						userId: currentUser.id,
						username: currentUser.username,
					} as IListenerDetail,
					+stationId
				)
				.then((response) => {
					setLoaded(true);
				});
		}

		return () => {
			if (isConnected) {
				hubConnection.invoke(
					"LeaveStationRoom",
					{
						userId: currentUser.id,
						username: currentUser.username,
					} as IListenerDetail,
					+stationId
				);
			}
		};
	}, [isConnected]);

	function handleSaveClick() {
		StationService.updateStation({
			id: stationDetail.id,
			name: stationName,
			description: stationDetail.description,
			private: stationPrivate,
		})
			.then((response) => {
				setResponseMessage({
					error: false,
					message: "Your changes have been saved",
				});
			})
			.catch((error) => {
				setResponseMessage({
					error: true,
					message: error.response?.data,
				});
			});
	}

	function handleStationNameChange(event: React.FormEvent<HTMLInputElement>) {
		setStationName(event.currentTarget.value);
	}

	function handlePrivateChange(event: React.FormEvent<HTMLInputElement>) {
		setStationPrivate(!stationPrivate);
	}

	return (
		<div className="flex justify-center">
			<div className="flex flex-col pr-5 max-w-6xl w-full">
				<div className="flex pb-2">
					<SearchBar stationId={+stationId}></SearchBar>
				</div>
				<div className="flex justify-evenly">
					<div className="border w-full border-gray-600">
						<SongBox
							isUserOwner={
								stationDetail.ownerId === currentUser.id
							}
							stationId={+stationId}
						></SongBox>
					</div>
					<div className="border w-full border-gray-600">
						<ChatBox
							loaded={loaded}
							stationId={+stationId}
						></ChatBox>
					</div>
				</div>
			</div>
			<div className="flex flex-col max-w-sm w-full">
				<div className="pb-5">
					<Input
						value={stationName}
						onChange={handleStationNameChange}
					></Input>
				</div>
				<label className="pb-5">
					<input
						type="checkbox"
						className="mr-1"
						checked={stationPrivate}
						onChange={handlePrivateChange}
					></input>
					Private Station
				</label>
				<Button onClick={handleSaveClick}>Save</Button>
				<ResponseMessage
					responseMessage={responseMessage}
				></ResponseMessage>
			</div>
		</div>
	);
}

export default Station;
