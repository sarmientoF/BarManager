import { ref, set, update } from "firebase/database";
import React, { FormEvent, useContext, useRef, useState } from "react";
import { actionCodeSettings, AuthContext } from "../../context/AuthContext";
import { User } from "../../data/data";
import { auth, db } from "../../firebase";
import { v4 as uuid } from "uuid";
import { sendSignInLinkToEmail } from "@firebase/auth";
interface Props {
	user: User;
	open: boolean;
	setOpen: (state: boolean) => void;
}

const MigrateModal = ({ user, open, setOpen }: Props) => {
	const uid = user.uid;

	const emailRef = useRef<HTMLInputElement>(null);

	const [loading, setLoading] = useState(false);

	const [error, setError] = useState("");

	const handleUpdate = async (e: FormEvent) => {
		e.preventDefault();
		setLoading(true);

		const email = emailRef.current?.value;
		if (email) {
			try {
				await sendSignInLinkToEmail(auth, email, {
					...actionCodeSettings,
					url: `https://barmanagerx.web.app/verify_signin?uid=${user.uid}&email=${email}`,
				});
				let updates: any = {};
				updates["email"] = email;
				await update(ref(db, `users/${user.uid}/attributes`), updates);
				setOpen(false);
				setLoading(false);
				return;
			} catch (error) {
				setError("サーバーエラー");
			}
		}
		setError("メールなし");

		setLoading(false);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<div className={`modal ${open && "modal-open"} transition-all`}>
			<span
				className="absolute w-full h-full"
				onClick={() => {
					setOpen(false);
				}}
			></span>

			<div className="modal-box">
				<form className="card-body" onSubmit={handleUpdate}>
					{error && (
						<div className="alert alert-error">
							<div className="flex-1">
								<label>{error}</label>
							</div>
						</div>
					)}
					<div className="form-control">
						<label className="label">
							<span className="label-text">メール</span>
						</label>
						<input
							required
							type="email"
							placeholder="メール"
							className="input input-bordered required:input-info  focus:invalid:input-error valid:input-info"
							ref={emailRef}
						/>
					</div>

					<div className="form-control mt-6 flex-row justify-around space-x-1">
						<input
							type="submit"
							value="メール送信"
							className="btn btn-info text-white w-1/2"
							disabled={loading || error != ""}
						/>
						<input
							type="button"
							value="キャンセル"
							className="btn btn-error text-white w-1/2"
							onClick={handleClose}
							disabled={loading}
						/>
					</div>
				</form>
			</div>
		</div>
	);
};

export default MigrateModal;
