import React, { Children, FC } from "react";
import MyNavigationBar from "./MyNavigationBar";

interface Props {}

const PrivateContainer: FC = (props) => {
	return (
		<main className="flex-grow block overflow-x-hidden bg-base-100 text-base-content drawer-content">
			<div className=" inset-x-0 top-0 z-50 w-full transition duration-200 ease-in-out border-b border-base-200 bg-base-100 text-base-content fixed">
				<MyNavigationBar />
			</div>
			<div className="mx-auto space-x-1 navbar max-w-none"></div>
			{props.children}
		</main>
	);
};

export default PrivateContainer;
