import { HubConnection } from "@microsoft/signalr";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "../../custom-elements";
import IListenerDetail from "../../models/station/IListenerDetail";
import IStationMessage from "../../models/station/IStationMessage";
import ChatService from "../../services/ChatService";
import SongService from "../../services/SongService";
import StationService from "../../services/StationService";
import { setStationMessages } from "../../store/chat-slice";
import { setStationUsers } from "../../store/connection-slice";
import { hubConnection } from "../../store/station-connection";
import { RootState } from "../../store/store";
import Moment from "react-moment";
import ScrollableFeed from "react-scrollable-feed";
import ChatMessages from "./ChatMessages";

interface Props {
  stationId: number;
  loaded: boolean;
}

function ChatBox(props: Props) {
  const [loaded, setLoaded] = useState(false);
  const listeners = useSelector(
    (state: RootState) => state.connectionReducier.usersInStation
  );
  const stationMessages = useSelector(
    (state: RootState) => state.chatReducer.stationMessages
  );
  const dispatch = useDispatch();
  const [commentValue, setCommentValue] = useState("");
  useEffect(() => {
    if (props.loaded) {
      StationService.getStationListeners(props.stationId).then((response) => {
        dispatch(setStationUsers(response.data));
        ChatService.getStationMessages(props.stationId).then((response) => {
          dispatch(setStationMessages(response.data));
          setLoaded(true);
        });
      });
    }
    return () => {
      dispatch(setStationMessages([]));
    };
  }, [props.loaded]);

  function handleCommentValueChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setCommentValue(event.currentTarget.value);
  }

  function handleKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" && commentValue.length) {
      ChatService.addStationMessage(props.stationId, commentValue);
      setCommentValue("");
    }
  }

  return (
    <div className="chat-box-container">
      {loaded ? (
        <Fragment>
          <div className="flex flex-col h-9/10">
            <ChatMessages messages={stationMessages} />
          </div>
          <div>
            <Input
              placeholder="Enter a comment..."
              value={commentValue}
              onChange={handleCommentValueChange}
              onKeyPress={handleKeyPress}
            />
          </div>
        </Fragment>
      ) : (
        <div>Connecting to chat...</div>
      )}
    </div>
  );
}

export default ChatBox;
