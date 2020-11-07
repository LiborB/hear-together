import Axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import IStationDetail from "../../models/station/IStationDetail";

interface RouteParams {
	stationId: string;
}

function Station() {
	const { stationId } = useParams<RouteParams>();
	const [stationDetail, setStationDetail] = useState<IStationDetail>(
		{} as IStationDetail
	);
	useEffect(() => {
		Axios.get<IStationDetail>(`station/details/${stationId}`).then(
			(response) => {
				setStationDetail(response.data);
			}
		);
	}, []);

	return <div className="flex justify-center">{stationDetail.name}</div>;
}

export default Station;
