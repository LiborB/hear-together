import Axios from "axios";
import { setuid } from "process";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { Button, FormError, Input } from "../../custom-elements";
import { IUser } from "../../models/IUser";
import { RootState } from "../../store/store";
import { setCurrentUser, setIsLoggedIn } from "../../store/user-slice";

function Login() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [formError, setFormError] = useState("");
	const history = useHistory();
	const dispatch = useDispatch();
	function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!username || !password) {
			return;
		}
		Axios.post<IUser>("user/login", {
			username: username,
			password: password,
		})
			.then((response) => {
				Axios.defaults.headers.common = {
					user_token: response.data.token,
				};
				localStorage.setItem("user_token", response.data.token);
				dispatch(setCurrentUser(response.data));
				dispatch(setIsLoggedIn(true));
				history.push("/dashboard");
			})
			.catch((error) => {
				setFormError(error.response.data);
			});
	}
	return (
		<form onSubmit={handleSubmit}>
			<div className="flex justify-center items-center flex-col mx-auto max-w-md">
				<div className="text-4xl pb-2">Login</div>
				<FormError className="text-sm">{formError}</FormError>
				<div className="w-full pb-2">
					<Input
						error={Boolean(formError)}
						value={username}
						onInput={(event) =>
							setUsername(event.currentTarget.value)
						}
						placeholder="Username"
					></Input>
				</div>
				<div className="w-full py-2">
					<Input
						error={Boolean(formError)}
						value={password}
						type="password"
						onInput={(event) =>
							setPassword(event.currentTarget.value)
						}
						placeholder="Password"
					></Input>
				</div>
				<div className="w-full pt-2">
					<Button type="submit" className="w-full text-lg">
						Login
					</Button>
				</div>
				<div className="pt-2">
					<Link className="underline" to="/signup">
						New here? Create an account
					</Link>
				</div>
			</div>
		</form>
	);
}

export default Login;
