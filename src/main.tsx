import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter as Router } from "react-router-dom";

ReactDOM.render(
	<AuthProvider>
		<Router>
			<App />
		</Router>
	</AuthProvider>,
	document.getElementById("root")
);
