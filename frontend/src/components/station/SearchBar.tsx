import React, { useRef, useState } from "react";
import {
	Input,
	IResponseMessage,
	ResponseMessage,
} from "../../custom-elements";
import useComponentVisible from "../../hooks/component-visible";
import ISongDetail from "../../models/song/ISongDetail";
import ISongSearchItem from "../../models/song/ISongSearchItem";
import SongService from "../../services/SongService";

interface Props {
	stationId: number;
}
export default function SearchBar(props: Props) {
	const [searchValue, setSearchValue] = useState("");
	const [responseMessage, setResponseMessage] = useState(
		{} as IResponseMessage
	);
	const {
		ref,
		isComponentVisible,
		setIsComponentVisible,
	} = useComponentVisible(false);
	const [foundSongs, setFoundSongs] = useState([] as ISongSearchItem[]);
	const typingTimeout = useRef(0);
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
							message: "Successfully added song to queue",
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
		const value = event.currentTarget.value;
		setSearchValue(value);
		if (typingTimeout) {
			clearTimeout(typingTimeout.current);
		}

		if (value) {
			typingTimeout.current = window.setTimeout(() => {
				SongService.searchForSongs(value).then((response) => {
					setFoundSongs(response.data);
				});
			}, 500);
		} else {
			setFoundSongs([]);
		}
	}
	function handleSearchItemClick(item: ISongSearchItem) {
		SongService.addToQueue(item.id, props.stationId).then((response) => {
			setResponseMessage({
				error: false,
				message: "Successfully added song to queue",
			});
		});
		setIsComponentVisible(false);
		setSearchValue("");
		setFoundSongs([]);
	}
	return (
		<div className="w-full">
			<div className="relative">
				<Input
					onClick={() => setIsComponentVisible(true)}
					maxLength={50}
					value={searchValue}
					onChange={handleSearchValueChange}
					onKeyDown={handleKeydown}
					placeholder="Search for a song or enter a youtube link..."
				></Input>
				{Boolean(foundSongs.length) && isComponentVisible && (
					<ul
						ref={ref}
						className="absolute transform translate-y-1 rounded-md border border-teal-100 bg-gray-800 w-full"
					>
						{foundSongs.map((item) => (
							<li
								onClick={() => handleSearchItemClick(item)}
								className="text-teal-300 px-2 flex justify-between w-full align-middle pb-2 cursor-pointer hover:opacity-50"
								key={item.id}
							>
								<span>{item.title}</span>
							</li>
						))}
					</ul>
				)}
			</div>

			<ResponseMessage
				responseMessage={responseMessage}
			></ResponseMessage>
		</div>
	);
}
