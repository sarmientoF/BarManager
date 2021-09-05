import React, { FormEvent, InputHTMLAttributes, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import logo from "../login.svg";
import { MdErrorOutline } from "react-icons/md";
import { Redirect } from "react-router";
interface Props {}

const SignInPage = (props: Props) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const emailRef = useRef<HTMLInputElement>(null);
	const { currentUser } = useAuth();

	const { sendSignInLink } = useAuth();
	const handleSignIn = async (e: FormEvent) => {
		e.preventDefault();
		const email = emailRef.current?.value;
		if (!email) return;
		setLoading(true);
		window.localStorage.setItem("emailForSignIn", email);
		try {
			await sendSignInLink(email);
		} catch (error) {
			setError("🚨Coudn't send email");
		}
	};

	if (currentUser) {
		return <Redirect to="/" />;
	}

	return (
		<div
			className="hero min-h-screen  bg-base-200 "
			// className="hero min-h-screen bg-blend-overlay  bg-opacity-50"
			// style={{
			// 	backgroundImage: `url("https://picsum.photos/1600/1400?blur=2")`,
			// 	// backgroundColor: "rgba(52, 52, 52, 1.3)",
			// }}
		>
			<div className="flex-col justify-center hero-content lg:flex-row">
				<div className="text-center lg:text-left">
					<h1 className="mb-5 text-5xl font-bold">Hello there</h1>
					<p className="mb-5">
						Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
						excepturi exercitationem quasi. In deleniti eaque aut repudiandae et
						a id nisi.
					</p>
				</div>
				<div className="card flex-shrink-0 w-full max-w-sm  bg-base-100  shadow-2xl filter drop-shadow-2xl ">
					<form className="card-body" onSubmit={handleSignIn}>
						{error && (
							<div className="alert alert-error">
								<div className="flex-1">
									<label>{error}</label>
								</div>
							</div>
						)}
						<div className="form-control">
							<label className="label">
								<span className="label-text">Email</span>
							</label>
							<input
								type="email"
								placeholder="email"
								className="input input-bordered required:input-info  focus:invalid:input-error valid:input-info"
								required
								ref={emailRef}
							/>
						</div>
						<div className="form-control mt-6">
							<button
								type="submit"
								className="font-semibold text-lg btn btn-primary border-none bg-gradient-to-tr from-yellow-400 via-red-500 to-pink-500 disabled:opacity-70 "
								disabled={loading}
							>
								Sign In
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default SignInPage;
