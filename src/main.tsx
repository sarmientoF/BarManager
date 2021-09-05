import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter as Router } from "react-router-dom";

ReactDOM.render(
	<Provider store={store}>
		<AuthProvider>
			<Router>
				<App />
			</Router>
		</AuthProvider>
	</Provider>,
	document.getElementById("root")
);
