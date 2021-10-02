import { ref, set } from "firebase/database";
import React, { useRef, useState } from "react";
import PrivateContainer from "../components/common/PrivateContainer";
import { db } from "../firebase";
import { v4 as uuid } from "uuid";
interface Props {}

const roles = [
	{ value: "employees", tag: "スタッフ" },
	{ value: "admins", tag: "アドミン" },
];

const AddStaffPage = (props: Props) => {
	const roleRef = useRef<HTMLSelectElement>(null);
	const emailRef = useRef<HTMLInputElement>(null);

	const [message, setMessage] = useState<{
		message: string;
		success?: boolean;
	}>({ message: "" });

	const [loading, setLoading] = useState(false);

	const handleAdd = async () => {
		setLoading(true);
		const role = roleRef.current?.value;
		const email = emailRef.current?.value;
		if (!role || !email) return;

		// return;
		try {
			set(ref(db, `roles/${uuid()}`), {
				isAdmin: "admins" == role,
				email: email,
			});

			setMessage({ success: true, message: "🚀 追加しました!" });
		} catch (error) {
			setMessage({ success: true, message: "🚨 サーバーエラー" });
		}
		setOpen(true);
		setLoading(false);
	};

	const [open, setOpen] = useState(false);
	return (
		<PrivateContainer>
			{open && (
				<div
					className={[
						"alert px-4 py-3 rounded relative flex-row",
						message.success ? "alert-success" : "alert-error",
					].join(" ")}
					role="alert"
				>
					<strong className="font-bold">{message.message}</strong>

					<span
						className=""
						onClick={() => {
							setOpen(false);
						}}
					>
						<svg
							className="fill-current h-6 w-6 "
							role="button"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
						>
							<title>Close</title>
							<path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
						</svg>
					</span>
				</div>
			)}{" "}
			<div className="hero min-h-screen bg-base-200">
				<div className="text-center hero-content w-full">
					<div className="card flex-shrink-0 w-full max-w-lg bg-base-100  shadow-2xl filter drop-shadow-2xl ">
						<div className="card-body">
							{/* {error && (
									<div className="alert alert-error">
										<div className="flex-1">
											<label>{error}</label>
										</div>
									</div>
								)} */}
							<div className="form-control">
								<label className="label">
									<span className="label-text">メール</span>
								</label>
								<input
									type="email"
									placeholder="メール"
									className="input input-bordered required:input-info  focus:invalid:input-error valid:input-info invalid:input-error"
									required
									ref={emailRef}
									autoComplete="email"
								/>
							</div>
							<div className="form-control">
								<label className="label">
									<span className="label-text">タイプ</span>
								</label>

								<select
									required
									className="select select-bordered w-full"
									ref={roleRef}
								>
									{roles.map((role) => (
										<option key={role.value} value={role.value}>
											{role.tag}
										</option>
									))}
								</select>
							</div>
							<div className="form-control mt-6">
								<button
									type="submit"
									className="font-semibold text-lg btn btn-primary border-none bg-gradient-to-tr from-yellow-500 via-red-400 to-pink-500 disabled:opacity-70 "
									disabled={loading}
									onClick={handleAdd}
								>
									追加する
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</PrivateContainer>
	);
};

export default AddStaffPage;
