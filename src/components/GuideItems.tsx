import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthCotnext, AuthProvider } from "../context/AuthContext";
import { my_paths } from "./common/MyNavigationBar";

function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(" ");
}

export default function GuideItems() {
	const { isAdmin } = useContext(AuthCotnext);
	const paths = !isAdmin ? my_paths.slice(1, -1) : my_paths;

	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
			{paths.map((path) => (
				<div
					key={path.tag}
					className="relative rounded-lg border border-gray-300 bg-base-100 px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-400"
				>
					<div className="flex-shrink-0"></div>
					<div className="flex-1 min-w-0">
						<Link to={path.ref} className="focus:outline-none">
							<span className="absolute inset-0" aria-hidden="true" />
							<p className="text-lg font-bold ">{path.tag}</p>
							{/* <p className="text-lg truncate">●●●●●●</p> */}
						</Link>
					</div>
				</div>
			))}
		</div>
	);
}
