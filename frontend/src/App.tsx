import React, { Fragment, useEffect } from "react";
import "./App.css";
import { Route, Switch } from "react-router-dom";
import Login from "./components/login/Login";
import Home from "./Home";
import Signup from "./components/signup/Signup";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser, setIsLoggedIn, UserState } from "./store/user-slice";
import { RootState } from "./store/store";
import Axios from "axios";
import { IUser } from "./models/user/IUser";
import Navbar from "./components/nav/Navbar";
import Dashboard from "./components/dashboard/Dashboard";
import Station from "./components/station/Station";
import Profile from "./components/profile/Profile";
import UserService from "./services/UserService";

function App() {
	const isLoggedIn = useSelector(
		(state: RootState) => state.userReducer.isLoggedIn
	);
	const dispatch = useDispatch();

	useEffect(() => {
		const token = localStorage.getItem("user_token");
		if (token) {
			UserService.auth(token)
				.then((response) => {
					Axios.defaults.headers.common = {
						user_token: response.data.token,
					};
					dispatch(setCurrentUser(response.data));
					dispatch(setIsLoggedIn(true));
				})
				.catch(() => {
					localStorage.removeItem("user_token");
					dispatch(setIsLoggedIn(false));
				});
		} else {
			dispatch(setIsLoggedIn(false));
		}
	}, []);
	return (
		<div className="h-full text-white pb-10">
			<Navbar></Navbar>
			<div className="pt-20">
				<Switch>
					<Route path="/login">
						<Login />
					</Route>
					<Route path="/signup">
						<Signup></Signup>
					</Route>
					{isLoggedIn && (
						<Fragment>
							<Route path="/dashboard">
								<Dashboard></Dashboard>
							</Route>
							<Route path="/station/:stationId">
								<Station></Station>
							</Route>
							<Route path="/profile/:userId">
								<Profile></Profile>
							</Route>
						</Fragment>
					)}

					<Route path="/">
						<Home />
					</Route>
				</Switch>
			</div>
		</div>
	);
}

export default App;
