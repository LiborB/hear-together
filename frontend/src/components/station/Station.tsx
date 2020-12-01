import Axios from "axios";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  Button,
  Input,
  IResponseMessage,
  ResponseMessage,
  TextArea,
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
  const { currentUser } = useSelector((state: RootState) => state.userReducer);
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
  const [stationDescription, setStationDescription] = useState("");
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
          StationService.getStationDetail(+stationId).then((response) => {
            setStationDetail(response.data);
            setStationName(response.data.name);
            setStationPrivate(response.data.private);
          });
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
    if (!stationName.length) {
      return;
    }
    StationService.updateStation({
      id: stationDetail.id,
      name: stationName,
      description: stationDescription,
      private: stationPrivate,
    })
      .then((response) => {
        setResponseMessage({
          error: false,
          message: "Your changes have been saved",
        });
        setStationDetail({
          ...stationDetail,
          name: stationName,
          description: stationDescription,
          private: stationPrivate,
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

  function handleDescriptionChange(
    event: React.FormEvent<HTMLTextAreaElement>
  ) {
    setStationDescription(event.currentTarget.value);
  }

  return (
    <div className="flex justify-center sm:flex-col flex-wrap">
      <div className="flex flex-col pr-5 w-full max-w-6xl sm:pr-0">
        <div className="text-2xl">
          {stationDetail.name}&nbsp;
          <span className="text-xs">
            {stationDetail.numberOfListeners}{" "}
            {stationDetail.numberOfListeners > 1 ? "listeners" : "listener"}
          </span>
        </div>
        <div className="">{stationDetail.description}</div>
        <div className="flex flex-col pr-5 max-w-6xl w-full sm:pr-0">
          <div className="flex pb-2 pt-4">
            <SearchBar stationId={+stationId} />
          </div>
          <div className="flex justify-evenly sm:flex-col">
            <div className="w-full flex flex-col sm:pt-6">
              <span className="self-center text-xl text-teal-300">Songs</span>
              <div className="border border-gray-600">
                <SongBox
                  isUserOwner={stationDetail.ownerId === currentUser.id}
                  stationId={+stationId}
                />
              </div>
            </div>
            <div className="w-full flex flex-col sm:pt-6">
              <span className="self-center text-xl text-teal-300">Chat</span>
              <div className="border w-full border-gray-600">
                <ChatBox loaded={loaded} stationId={+stationId} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {stationDetail.ownerId === currentUser.id && (
        <div className="flex flex-col max-w-sm w-full flex-shrink-2 sm:pt-6 sm:max-w-full">
          <span className="text-xl text-center text-primary">Settings</span>
          <div className="pb-5">
            <Input
              placeholder="Enter your station name"
              value={stationName}
              onChange={handleStationNameChange}
            />
          </div>
          <label className="pb-5">
            <input
              title="Only you can view this station"
              type="checkbox"
              className="mr-1"
              checked={stationPrivate}
              onChange={handlePrivateChange}
            />
            Private Station
          </label>
          <label className="pb-5">
            <TextArea
              placeholder="Enter a description of your station"
              value={stationDescription}
              onChange={handleDescriptionChange}
            />
          </label>
          <Button onClick={handleSaveClick}>Save</Button>
          <ResponseMessage responseMessage={responseMessage} />
        </div>
      )}
    </div>
  );
}

export default Station;
