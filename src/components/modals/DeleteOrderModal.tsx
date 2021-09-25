import { arrayUnion, setDoc, updateDoc } from "@firebase/firestore";
import { deleteDoc, deleteField, doc } from "firebase/firestore";
import React, { FormEvent, useRef, useState } from "react";
import { db } from "../../firebase";

interface Props {
	order: { uid: string; userId: string };
	open: boolean;
	setOpen: (state: boolean) => void;
}

const DeleteOrderModal = ({ order, open, setOpen }: Props) => {
	const [loading, setLoading] = useState(false);

	const handleDelete = async (e: FormEvent) => {
		e.preventDefault();
		setLoading(true);

		const orderRef = doc(db, "orders", order.uid);
		const userRef = doc(db, "users", order.userId);
		await updateDoc(userRef, {
			["relationships.orders." + order.uid]: deleteField(),
		});
		await deleteDoc(orderRef);

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
					<div className="form-control mt-6">
						<input
							type="button"
							value="削除する"
							className="btn btn-error text-white"
							onClick={handleDelete}
							disabled={loading}
						/>
					</div>
					<div className="form-control mt-6">
						<input
							type="button"
							value="キャンセル"
							className="btn btn-ghost btn-outline text-white"
							onClick={handleClose}
							disabled={loading}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DeleteOrderModal;
