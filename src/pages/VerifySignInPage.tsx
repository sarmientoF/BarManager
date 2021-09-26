import React, { useEffect, useState } from "react";
import { VscLoading } from "react-icons/vsc";
import { useHistory } from "react-router";
import { useAuth } from "../context/AuthContext";
interface Props {}

const VerifySignInPage = (props: Props) => {
	const { signInWithLink } = useAuth();
	const [message, setMessage] = useState<{
		message: string;
		success?: boolean;
	}>({ message: "" });
	const history = useHistory();

	const handleSignIn = async () => {
		const res = await signInWithLink();
		setMessage(res);
		if (res.success) history.push("/");
	};
	useEffect(() => {
		handleSignIn();
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
					{!message.message && (
						<VscLoading className="w-12 h-12 mr-2 animate-spin" />
					)}
					<h1 className="mb-5 text-5xl font-bold">
						{message.message || "ローディング..."}
					</h1>
				</div>
			</div>
		</div>
	);
};

export default VerifySignInPage;
