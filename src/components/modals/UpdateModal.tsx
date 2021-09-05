import { updateDoc } from "@firebase/firestore";
import { doc } from "firebase/firestore";
import React, { useRef, useState } from "react";
import { UserState } from "../../features/user/user-slice";
import { database } from "../../firebase";

interface Props {
	user: UserState;
	open: boolean;
	setOpen: (state: boolean) => void;
}

const UpdateModal = ({ user, open, setOpen }: Props) => {
	const uid = user.uid;

	const nameRef = useRef<HTMLInputElement>(null);
	const jobRef = useRef<HTMLInputElement>(null);
	const phoneRef = useRef<HTMLInputElement>(null);
	const [loading, setLoading] = useState(false);

	const handleUpdate = async () => {
		const name = nameRef.current?.value || "";
		const job = jobRef.current?.value || "";
		const phone = phoneRef.current?.value || "";

		setLoading(true);
		await updateDoc(doc(database.users, uid), {
			updatedAt: database.getCurrentTimestamp(),
			"attributes.name": name,
			"attributes.phone": phone,
			"attributes.job": job,
		});
		setLoading(false);
		setOpen(false);
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
				<div className="card-body">
					<div className="form-control">
						<label className="label">
							<span className="label-text">Name</span>
						</label>
						<input
							type="text"
							placeholder="name"
							className="input input-bordered"
							defaultValue={user.attributes.name}
							ref={nameRef}
						/>
					</div>
					<div className="form-control">
						<label className="label">
							<span className="label-text">Job</span>
						</label>
						<input
							type="text"
							placeholder="job"
							className="input input-bordered"
							defaultValue={user.attributes.job}
							ref={jobRef}
						/>
					</div>
					<div className="form-control">
						<label className="label">
							<span className="label-text">Phone</span>
						</label>
						<input
							type="text"
							placeholder="phone"
							className="input input-bordered"
							defaultValue={user.attributes.phone}
							ref={phoneRef}
						/>
					</div>
					<div className="form-control mt-6">
						<input
							type="button"
							value="Update"
							className="btn btn-info text-white"
							onClick={handleUpdate}
							disabled={loading}
						/>
					</div>
					<div className="form-control mt-6">
						<input
							type="button"
							value="Cancel"
							className="btn btn-error text-white"
							onClick={handleClose}
							disabled={loading}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default UpdateModal;
