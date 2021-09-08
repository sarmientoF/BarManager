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
			<div
				className="hero min-h-screen bg-base-200"
				style={{
					backgroundImage:
						"url(https://static01.nyt.com/images/2018/08/12/travel/12highball-E/merlin_141865956_c92b531e-177d-4924-a922-bafda6c620d2-superJumbo.jpg)",
				}}
			>
				<div className="hero-overlay bg-opacity-60"></div>

				<div className="text-center hero-content bg-opacity-60">
					<div className="max-w-md space-y-12">
						<h1 className="mb-5 text-5xl font-bold">バーの名前</h1>
						<p className="mb-5">ここはバーの情報を載せます。</p>
					</div>
				</div>
			</div>
		</PrivateContainer>
	);
};

export default DashboardPage;
