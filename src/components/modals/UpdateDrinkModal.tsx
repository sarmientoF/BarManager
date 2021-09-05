import { updateDoc } from "@firebase/firestore";
import { doc } from "firebase/firestore";
import React, { useRef, useState } from "react";
import { DrinkState, UserState } from "../../features/user/user-slice";
import { database } from "../../firebase";

interface Props {
	drink: DrinkState;
	open: boolean;
	setOpen: (state: boolean) => void;
}

const UpdateDrinkModal = ({ drink, open, setOpen }: Props) => {
	const uid = drink.uid;

	const nameRef = useRef<HTMLInputElement>(null);

	const [loading, setLoading] = useState(false);

	const handleUpdate = async () => {
		const name = nameRef.current?.value || "";


		setLoading(true);
		await updateDoc(doc(database.drinks, uid), {
			updatedAt: database.getCurrentTimestamp(),
			"attributes.name": name,
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
							defaultValue={drink.attributes.name}
							ref={nameRef}
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

export default UpdateDrinkModal;
