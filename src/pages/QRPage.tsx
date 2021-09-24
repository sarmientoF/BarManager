import React from "react";
import QrReader from "react-qr-reader";
import PrivateContainer from "../components/common/PrivateContainer";
import SearchModal from "../components/modals/SearchDrinkModal";

interface Props {}

const QRPage = (props: Props) => {
	return (
		<PrivateContainer>
			<div className="hero min-h-screen bg-base-200">
				<div className="text-center hero-content">
					<div className="max-w-md">
						<h1 className="mb-5 text-5xl font-bold">Hello there</h1>
						<p className="mb-5">
							Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
							excepturi exercitationem quasi. In deleniti eaque aut repudiandae
							et a id nisi.
						</p>
						<QrReader
							delay={300}
							onError={() => {}}
							onScan={() => {}}
							style={{ width: "100%" }}
						/>
						{/* <p>{this.state.result}</p> */}
						<button className="btn btn-primary">Get Started</button>
					</div>
				</div>
			</div>
		</PrivateContainer>
	);
};

export default QRPage;
