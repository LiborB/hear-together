import Axios from "axios";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Button } from "../../custom-elements";
import StationService from "../../services/StationService";
import { RootState } from "../../store/store";
import StationList from "./StationList";

function Dashboard() {
    const history = useHistory();
    const { isLoggedIn } = useSelector((state: RootState) => state.userReducer);
    useEffect(() => {
        if (isLoggedIn === false) {
            history.push("/login");
        }
    }, [isLoggedIn]);
    function handleCreateStationClick() {
        StationService.createStation().then((response) => {
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
            {isLoggedIn && <StationList></StationList>}
        </div>
    );
}

export default Dashboard;
