import Axios from "axios";
import { stat } from "fs";
import React, { useEffect, useState } from "react";
import IStationSimple from "../../models/station/IStationSimple";
import StationService from "../../services/StationService";
import StationListItem from "./StationListItem";

function StationList() {
    const [stations, setStations] = useState([] as IStationSimple[]);
    useEffect(() => {
        StationService.getAllStations().then((response) => {
            setStations(response.data);
        });
    }, []);
    return (
        <div className="grid grid-cols-3 gap-8 sm:grid-cols-1 md:grid-cols-2">
            {stations.map((station) => (
                <StationListItem key={station.id} station={station}></StationListItem>
            ))}
        </div>
    );
}

export default StationList;
