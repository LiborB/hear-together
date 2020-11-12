import Axios from "axios";
import React from "react";
import { useHistory } from "react-router-dom";
import { Button } from "../../custom-elements";

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
		<div className="flex justify-center mt-20">
			<Button onClick={handleCreateStationClick} outlined>
				Create a station
			</Button>
		</div>
	);
}

export default Dashboard;
