import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { RootState } from "./store/store";

function Home() {
	const { isLoggedIn } = useSelector((state: RootState) => state.userReducer);
	const history = useHistory();
	useEffect(() => {
		if (isLoggedIn) {
			history.push("/dashboard");
		} else {
			history.push("/login");
		}
	}, []);
	return <div>home page</div>;
}

export default Home;
