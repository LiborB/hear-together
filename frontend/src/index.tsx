import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./tailwind.output.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import Axios from "axios";
import { store } from "./store/store";
import apiSettings from "./api-settings.json";


if (window.location.hostname.endsWith("heartogether.liborb.com")) {
	Axios.defaults.baseURL = "api/";
} else {
	Axios.defaults.baseURL = "https://localhost:5001/api/";
}

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</Provider>
	</React.StrictMode>,
	document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
