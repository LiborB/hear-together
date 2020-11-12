import Axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Input } from "../../custom-elements";
import IStationDetail from "../../models/station/IStationDetail";

interface RouteParams {
	stationId: string;
}

function Station() {
	const { stationId } = useParams<RouteParams>();
	const [stationDetail, setStationDetail] = useState<IStationDetail>(
		{} as IStationDetail
	);
	const [stationName, setStationName] = useState("");
	useEffect(() => {
		Axios.get<IStationDetail>(`station/details/${stationId}`).then(
			(response) => {
				setStationDetail(response.data);
				setStationName(response.data.name);
			}
		);
	}, []);

	return (
		<div className="flex justify-center">
			<div className="flex flex-col pr-5 max-w-6xl w-full">
				<div className="flex pb-2">
					<Input placeholder="Search for a song or enter a youtube link..."></Input>
				</div>
				<div className="flex justify-evenly">
					<div className="border w-full border-gray-600">
						song box
					</div>
					<div className="border w-full border-gray-600">
						chat box
					</div>
				</div>
			</div>
			<div className="flex flex-col max-w-sm w-full">
				<div className="pb-2">
					<Input value={stationName}></Input>
				</div>
				<label>
					<input type="checkbox" className="mr-1"></input>
					Private Station
				</label>
			</div>
		</div>
	);
}

export default Station;
