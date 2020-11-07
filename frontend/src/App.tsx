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
import { IUser } from "./models/IUser";
import Navbar from "./components/nav/Navbar";
import Dashboard from "./components/dashboard/Dashboard";
import Station from "./components/station/Station";

function App() {
	const isLoggedIn = useSelector(
		(state: RootState) => state.userReducer.isLoggedIn
	);
	const dispatch = useDispatch();

	useEffect(() => {
		const token = localStorage.getItem("user_token");
		if (token) {
			Axios.post<IUser>("user/auth", null, {
				headers: {
					user_token: token,
				},
			})
				.then((response) => {
					Axios.defaults.headers.common = {
						user_token: response.data.token,
					};
					dispatch(setCurrentUser(response.data));
					dispatch(setIsLoggedIn(true));
				})
				.catch(() => {
					localStorage.removeItem("user_token");
				});
		}
	}, []);
	return (
		<div className="bg-gray-900 h-full text-white">
			<Navbar></Navbar>
			<div className="pt-10">
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