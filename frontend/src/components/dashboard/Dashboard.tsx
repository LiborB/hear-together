import Axios from "axios";
import React from "react";
import { useHistory } from "react-router-dom";
import { Button } from "../../custom-elements";
import StationList from "./StationList";

function Dashboard() {
	const history = useHistory();
	function handleCreateStationClick() {
		Axios.post<number>("station/create").then((response) => {
			history.push({
				pathname: `/station/${response.data}`,
			});
		});
	}
	return (
		<div className="flex justify-center mt-20 flex-col max-w-6xl m-auto">
			<div className="flex justify-center pb-2">
				<Button onClick={handleCreateStationClick} outlined>
					Create a station
				</Button>
			</div>
			<StationList></StationList>
		</div>
	);
}

export default Dashboard;
