import React, { useState } from "react";
import {
	Input,
	IResponseMessage,
	ResponseMessage,
} from "../../custom-elements";
import ISongDetail from "../../models/song/ISongDetail";
import SongService from "../../services/SongService";

interface Props {
	stationId: number;
	onSongAdded?: (songDetail: ISongDetail) => void;
}
export default function SearchBar(props: Props) {
	const [searchValue, setSearchValue] = useState("");
	const [responseMessage, setResponseMessage] = useState(
		{} as IResponseMessage
	);
	function handleKeydown(event: React.KeyboardEvent<HTMLInputElement>) {
		if (event.key === "Enter") {
			if (searchValue.toUpperCase().includes("YOUTUBE.COM/WATCH?V=")) {
				SongService.addSongByUrl({
					stationId: props.stationId,
					youtubeUrl: searchValue,
				})
					.then((response) => {
						setResponseMessage({
							error: false,
							message:
								"Successfully added " +
								response.data.title +
								" to the queue",
						});
					})
					.catch((error) => {
						setResponseMessage({
							error: true,
							message: error?.response?.data,
						});
					});
			}
		}
	}

	function handleSearchValueChange(event: React.FormEvent<HTMLInputElement>) {
		setSearchValue(event.currentTarget.value);
	}
	return (
		<div className="w-full">
			<Input
				value={searchValue}
				onChange={handleSearchValueChange}
				onKeyDown={handleKeydown}
				placeholder="Search for a song or enter a youtube link..."
			></Input>
			<ResponseMessage
				responseMessage={responseMessage}
			></ResponseMessage>
		</div>
	);
}
