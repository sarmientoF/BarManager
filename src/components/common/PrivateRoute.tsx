import { FC } from "react";
import React from "react";
import { Redirect, Route } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface Props {
	exact?: boolean;
	path: string;
}
const PrivateRoute: FC<Props> = ({ children, ...rest }) => {
	const { currentUser } = useAuth();

	return (
		<Route exact={rest.exact} path={rest.path}>
			{currentUser ? children : <Redirect to="/signin" />}
		</Route>
	);
};

export default PrivateRoute;
