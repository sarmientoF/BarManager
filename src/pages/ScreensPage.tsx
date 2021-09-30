import React from "react";
import PrivateContainer from "../components/common/PrivateContainer";
import logo from "../main.png";

interface Props {}

const ScreensPage = (props: Props) => {
	return (
		<PrivateContainer>
			<div className="hero min-h-screen bg-base-200">
				<div className="text-center w-full p-4">
					<div className="grid gap-4 auto-cols-auto place-content-center">
						<div className="mockup-phone">
							<div className="camera"></div>
							<div className="display">
								<div className="artboard phone-1 artboard-demo">
									<img src={logo} alt="" />
								</div>
							</div>
						</div>
						<div className="mockup-phone">
							<div className="camera"></div>
							<div className="display">
								<div className="artboard phone-1 artboard-demo">
									<img src={logo} alt="" />
								</div>
							</div>
						</div>
						<div className="mockup-phone">
							<div className="camera"></div>
							<div className="display">
								<div className="artboard phone-1 artboard-demo">
									<img src={logo} alt="" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</PrivateContainer>
	);
};

export default ScreensPage;
