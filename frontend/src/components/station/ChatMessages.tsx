import React, { Fragment } from "react";
import IStationMessage from "../../models/station/IStationMessage";
import Moment from "react-moment";
import ScrollableFeed from "react-scrollable-feed";
interface Props {
  messages: IStationMessage[];
}
function ChatMessages(props: Props) {
  return (
    <div className="h-full">
      <ScrollableFeed>
        {props.messages.map((item) => (
          <div key={item.id} className="flex px-1 py-1 justify-between">
            <div className="text-sm break-all">
              <span className="text-red-300">{item.username}</span>
              &nbsp;
              <span>{item.message}</span>
            </div>
            <div className="pl-1 flex-shrink-0">
              <Moment
                utc
                local
                className="text-xs text-gray-500"
                date={item.created}
                format="HH:mm MMM DD"
              />
            </div>
          </div>
        ))}
      </ScrollableFeed>
    </div>
  );
}

export default ChatMessages;
