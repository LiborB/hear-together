import Axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Button, Input, IResponseMessage, ResponseMessage } from "../../custom-elements";
import IStationDetail from "../../models/station/IStationDetail";
import StationService from "../../services/StationService";
import SearchBar from "./SearchBar";
import SongBox from "./SongBox";

interface RouteParams {
    stationId: string;
}

function Station() {
    const { stationId } = useParams<RouteParams>();
    const [stationDetail, setStationDetail] = useState<IStationDetail>({} as IStationDetail);
    const [stationName, setStationName] = useState("");
    const [stationPrivate, setStationPrivate] = useState(false);
    const [responseMessage, setResponseMessage] = useState({} as IResponseMessage);
    useEffect(() => {
        StationService.getStationDetail(+stationId).then((response) => {
            setStationDetail(response.data);
            setStationName(response.data.name);
            setStationPrivate(response.data.private);
        });
    }, []);

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
                    <SearchBar stationId={stationDetail.id}></SearchBar>
                </div>
                <div className="flex justify-evenly">
                    <div className="border w-full border-gray-600">
                        <SongBox></SongBox>
                    </div>
                    <div className="border w-full border-gray-600">chat box</div>
                </div>
            </div>
            <div className="flex flex-col max-w-sm w-full">
                <div className="pb-5">
                    <Input value={stationName} onChange={handleStationNameChange}></Input>
                </div>
                <label className="pb-5">
                    <input type="checkbox" className="mr-1" checked={stationPrivate} onChange={handlePrivateChange}></input>
                    Private Station
                </label>
                <Button onClick={handleSaveClick}>Save</Button>
                <ResponseMessage responseMessage={responseMessage}></ResponseMessage>
            </div>
        </div>
    );
}

export default Station;
