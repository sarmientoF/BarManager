import React, { useContext, useState } from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import PrivateRoute from "./components/common/PrivateRoute";
import DashboardPage from "./pages/DashboardPage";
import SignInPage from "./pages/SignInPage";
import VerifySignInPage from "./pages/VerifySignInPage";
import OnlineUsersPage from "./pages/OnlineUsersPage";
import NewUsersPage from "./pages/NewUsersPage";
import AllUsersPage from "./pages/AllUsersPage";
import DrinksPage from "./pages/drinks/DrinksPage";

import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import AllOrdersPage from "./pages/AllOrdersPage";
import AddStaffPage from "./pages/AddStaffPage";
import { AuthContext } from "./context/AuthContext";
registerPlugin(
	FilePondPluginImageExifOrientation,
	FilePondPluginImagePreview,
	FilePondPluginFileValidateType
);

function App() {
	const { isAdmin } = useContext(AuthContext);

	return (
		<Switch>
			{/* <Redirect exact from="/" to="/all" /> */}

			<PrivateRoute exact path="/">
				<DashboardPage />
			</PrivateRoute>

			<PrivateRoute exact path="/new">
				<NewUsersPage />
			</PrivateRoute>
			<PrivateRoute exact path="/online">
				<OnlineUsersPage />
			</PrivateRoute>

			{isAdmin && (
				<PrivateRoute exact path="/all">
					<AllUsersPage />
				</PrivateRoute>
			)}
			{isAdmin && (
				<PrivateRoute exact path="/add">
					<AddStaffPage />
				</PrivateRoute>
			)}

			<PrivateRoute path="/drinks">
				<DrinksPage />
			</PrivateRoute>

			<PrivateRoute path="/orders">
				<AllOrdersPage />
			</PrivateRoute>

			<Route path="/signin">
				<SignInPage />
			</Route>
			<Route path="/verify_signin">
				<VerifySignInPage />
			</Route>
		</Switch>
	);
}

export default App;
