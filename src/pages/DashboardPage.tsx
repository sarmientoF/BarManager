import React from "react";
import { FaBeer } from "react-icons/fa";
import { IoIosNotificationsOutline } from "react-icons/io";
import { AiFillEye } from "react-icons/ai";
import MyNavigationBar from "../components/common/MyNavigationBar";
import { useHistory } from "react-router";
import PrivateContainer from "../components/common/PrivateContainer";
import { useAppSelector } from "../app/hooks";
interface Props {}

const DashboardPage = (props: Props) => {
	const { createdAt, updatedAt } = useAppSelector((state) => state.user.user);
	const history = useHistory();

	const handleUpdateProfile = () => {
		history.push("/update");
	};

	const handleGoToProfile = () => {
		history.push("/profile");
	};

	const isNew = createdAt === updatedAt;
	return (
		<PrivateContainer>
			<div className="hero min-h-screen bg-base-200">
				<div className="text-center hero-content ">
					<div className="max-w-md space-y-12">
						<h1 className="mb-5 text-5xl font-bold">Admin Landing</h1>
						<p className="mb-5">
							Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
							excepturi exercitationem quasi. In deleniti eaque aut repudiandae
							et a id nisi.
						</p>
						<ul className="w-full steps">
							<li className="step step-info">Register</li>
							<li className={`step ${!isNew && "step-info"}`}>
								Fill out your data
							</li>
						</ul>

						{isNew ? (
							<button onClick={handleUpdateProfile} className="btn btn-info">
								Update Profile
							</button>
						) : (
							<button onClick={handleGoToProfile} className="btn btn-info">
								Go to Profile
							</button>
						)}
					</div>
				</div>
			</div>
		</PrivateContainer>
	);
};

export default DashboardPage;
