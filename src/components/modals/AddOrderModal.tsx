import { arrayUnion, setDoc, updateDoc } from "@firebase/firestore";
import { addDoc, collection, doc } from "firebase/firestore";
import React, { FormEvent, useRef, useState } from "react";
import { useAppSelector } from "../../app/hooks";
import { UserState } from "../../features/user/user-slice";
import { database, db } from "../../firebase";

interface Props {
	user: UserState;
	open: boolean;
	setOpen: (state: boolean) => void;
}

const AddOrderModal = ({ user, open, setOpen }: Props) => {
	const uid = user.uid;

	const numberRef = useRef<HTMLInputElement>(null);
	const drinkRef = useRef<HTMLSelectElement>(null);

	const [loading, setLoading] = useState(false);

	const drinks = useAppSelector((state) => state.user.drinks);

	const handleUpdate = async (e: FormEvent) => {
		e.preventDefault();
		setLoading(true);

		const drinkCode = numberRef.current?.value;
		const drinkId = drinkRef.current?.value;

		if (drinkId && drinkCode) {
			const orderRef = await addDoc(database.orders, {
				updatedAt: database.getCurrentTimestamp(),
				createdAt: database.getCurrentTimestamp(),
				attributes: {
					userId: uid,
					drinkId: drinkId,
					drinkCode: drinkCode,
				},
			});
			await updateDoc(doc(database.users, uid), {
				updatedAt: database.getCurrentTimestamp(),
				["relationships.orders." + orderRef.id]: {
					drinkCode: drinkCode,
					drinkId: drinkId,
				},
			});
		}

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
				<form className="card-body" onSubmit={handleUpdate}>
					<div className="form-control">
						<label className="label">
							<span className="label-text">ボトル番号</span>
						</label>
						<input
							required
							type="number"
							placeholder="ボトル番号"
							className="input input-bordered"
							ref={numberRef}
						/>
					</div>
					<div className="form-control">
						<label className="label">
							<span className="label-text">銘柄名</span>
						</label>

						<select
							required
							className="select select-bordered w-full"
							ref={drinkRef}
							defaultValue="0"
						>
							<option value="0" disabled={true}>
								ボトルを選択してください
							</option>
							{drinks.map((drink) => (
								<option key={drink.uid} value={drink.uid}>
									{drink.attributes.name}
								</option>
							))}
						</select>
					</div>

					<div className="form-control mt-6 flex-row justify-around space-x-1">
						<input
							type="submit"
							value="ボトルを追加する"
							className="btn btn-info text-white w-1/2"
							disabled={loading}
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

export default AddOrderModal;
