import Axios from "axios";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import useComponentVisible from "../../hooks/component-visible";
import { RootState } from "../../store/store";
import { setCurrentUser, setIsLoggedIn } from "../../store/user-slice";

function UserMenu() {
	const { currentUser } = useSelector(
		(state: RootState) => state.userReducer
	);
	const history = useHistory();
	const dispatch = useDispatch();
	const {
		ref,
		isComponentVisible,
		setIsComponentVisible,
	} = useComponentVisible(false);

	function handleSignoutClick() {
		Axios.post("user/logout").then(() => {
			history.push("/login");
			setIsComponentVisible(false);
			dispatch(setIsLoggedIn(false));
			localStorage.removeItem("user_token");
		});
	}
	return (
		<div ref={ref} className="text-center relative w-32">
			<button
				className="p-2 border-b border-teal-300 focus:outline-none hover:border-teal-500"
				onClick={() => setIsComponentVisible(!isComponentVisible)}
			>
				Hi {currentUser.username}
			</button>
			{isComponentVisible && (
				<ul className="absolute flex flex-col justify-center w-full items-center mt-2 bg-gray-800 rounded-lg">
					<li className="py-2 w-full text-center cursor-pointer hover:text-teal-300">
						My Account
					</li>
					<li
						onClick={handleSignoutClick}
						className="py-2 w-full text-center cursor-pointer hover:text-teal-300"
					>
						Sign Out
					</li>
				</ul>
			)}
		</div>
	);
}

export default UserMenu;
