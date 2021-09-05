import React, { useState } from "react";
import { useAppDisptach, useAppSelector } from "./app/hooks";
import { useFetchBreedsQuery } from "./features/dogs/dogs-api-slice";
import { Route, Switch } from "react-router-dom";
import PrivateRoute from "./components/common/PrivateRoute";
import DashboardPage from "./pages/DashboardPage";
import SignInPage from "./pages/SignInPage";
import VerifySignInPage from "./pages/VerifySignInPage";
import UpdateProfile from "./pages/UpdateProfile";
import ProfilePage from "./pages/ProfilePage";
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
registerPlugin(
	FilePondPluginImageExifOrientation,
	FilePondPluginImagePreview,
	FilePondPluginFileValidateType
);

function App() {
	const count = useAppSelector((state) => state.counter.value);
	const dispatch = useAppDisptach();

	const [numDogs, setNumDogs] = useState(10);
	const { data = [], isFetching } = useFetchBreedsQuery(numDogs);

	const [files, setFiles] = useState([]);
	return (
		<Switch>
			<PrivateRoute exact path="/">
				<DashboardPage />
			</PrivateRoute>
			<PrivateRoute exact path="/all">
				<AllUsersPage />
			</PrivateRoute>
			<PrivateRoute exact path="/new">
				<NewUsersPage />
			</PrivateRoute>
			<PrivateRoute exact path="/online">
				<OnlineUsersPage />
			</PrivateRoute>
			<PrivateRoute exact path="/profile">
				<ProfilePage />
			</PrivateRoute>
			<PrivateRoute path="/drinks">
				<DrinksPage />
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
