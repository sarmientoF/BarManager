import React, { useEffect, useState } from "react";
import { VscLoading } from "react-icons/vsc";
import { useHistory } from "react-router";
import { useAuth } from "../context/AuthContext";
interface Props {}

const VerifySignInPage = (props: Props) => {
	const { signInWithLink } = useAuth();
	const [error, seterror] = useState("");
	const history = useHistory();
	useEffect(() => {
		signInWithLink()
			.then((result) => {
				if (result) return history.push("/");
				seterror("Could not sign in ☹️");
			})
			.catch(() => {
				seterror("Couldn't sign in ☹️");
			});
	}, []);
	return (
		<div
			className="hero min-h-screen"
			style={{
				backgroundImage: `url("https://picsum.photos/1600/1400")`,
			}}
		>
			<div className="hero-overlay bg-opacity-60"></div>
			<div className="text-center hero-content text-neutral-content">
				<div className="max-w-md flex">
					{!error && <VscLoading className="w-12 h-12 mr-2 animate-spin" />}
					<h1 className="mb-5 text-5xl font-bold">
						{error ? error : "Loading..."}
					</h1>
				</div>
			</div>
		</div>
	);
};

export default VerifySignInPage;
// https://picsum.photos/1600/1400?grayscale&blur=2