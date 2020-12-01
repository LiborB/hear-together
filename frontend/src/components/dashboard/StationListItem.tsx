import React from "react";
import { Link, useHistory } from "react-router-dom";
import IStationSimple from "../../models/station/IStationSimple";
import Station from "../station/Station";

interface Props {
  station: IStationSimple;
}
function StationListItem(props: Props) {
  const history = useHistory();
  function handleCardClick() {
    history.push(`/station/${props.station.id}`);
  }
  function handleUsernameClick(
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) {
    event.stopPropagation();
    history.push(`/profile/${props.station.ownerId}`);
  }
  return (
    <div
      onClick={handleCardClick}
      className="flex flex-col border rounded-xl border-gray-500 pt-1 px-4 hover:border-teal-200 border-opacity-50 transform cursor-pointer"
    >
      <div className="flex justify-between w-full items-center">
        <div className="text-xl text-teal-200">{props.station.name}</div>
        <div className="text-xs">
          {props.station.numberOfListeners} listeners
        </div>
      </div>
      <div className="text-sm">{props.station.description}</div>
      <div className="flex justify-end text-xs pb-1 pt-2">
        <span>Created by</span>&nbsp;
        <span
          className="font-semibold text-orange-300 hover:underline"
          onClick={handleUsernameClick}
        >
          {props.station.ownerUsername}
        </span>
      </div>
    </div>
  );
}

export default StationListItem;
