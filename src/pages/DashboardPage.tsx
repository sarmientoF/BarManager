import React from "react";
import PrivateContainer from "../components/common/PrivateContainer";
import GuideItems from "../components/GuideItems";
interface Props {}

const DashboardPage = (props: Props) => {


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
					<div className=" space-y-12">
						<GuideItems />
					</div>
				</div>
			</div>
		</PrivateContainer>
	);
};

export default DashboardPage;
