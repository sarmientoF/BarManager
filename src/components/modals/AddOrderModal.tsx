import { ref, set } from "firebase/database";
import React, { FormEvent, useContext, useRef, useState } from "react";
import { AuthCotnext } from "../../context/AuthContext";
import { User } from "../../data/data";
import { db } from "../../firebase";
import { v4 as uuid } from "uuid";
import { converJpNumbers } from "../../utils/Half2Kana";
interface Props {
	user: User;
	open: boolean;
	setOpen: (state: boolean) => void;
}

const AddOrderModal = ({ user, open, setOpen }: Props) => {
	const uid = user.uid;
	const {
		data: { drinks, orders },
	} = useContext(AuthCotnext);

	const drinkRef = useRef<HTMLSelectElement>(null);

	const [loading, setLoading] = useState(false);
	const [drinkCode, setDrinkCode] = useState("");
	const [drinkId, setDrinkId] = useState(drinks[0].uid);
	const [error, setError] = useState("");

	const handleUpdate = async (e: FormEvent) => {
		e.preventDefault();
		setLoading(true);

		if (drinkId && drinkCode) {
			const date = new Date().toISOString();
			const order_uid = uuid();
			await set(ref(db, `orders/${order_uid}`), {
				createdAt: date,
				updatedAt: date,
				attributes: {
					userId: uid,
					drinkId: drinkId,
					drinkCode: drinkCode,
				},
			});

			await set(ref(db, `users/${uid}/relationships/orders/${order_uid}`), {
				drinkCode: drinkCode,
				drinkId: drinkId,
			});
		}

		setLoading(false);
		setOpen(false);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const check = (drinkCode: string, drinkId: string) => {
		const orders_at = orders.filter(
			(order) => order.attributes.drinkCode == converJpNumbers(drinkCode)
		);
		if (orders_at.some((order) => order.attributes.drinkId == drinkId)) {
			setError(
				`すでにこのボトル番号に${
					drinks.find((e) => e.uid == drinkId)?.attributes.name
				}があります`
			);
		} else {
			setError("");
		}
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
							<span className="label-text">ボトル番号</span>
						</label>
						<input
							required
							type="number"
							placeholder="ボトル番号"
							className="input input-bordered"
							value={drinkCode}
							onChange={(val) => {
								setDrinkCode(val.currentTarget.value);
								check(val.currentTarget.value, drinkId);
							}}
						/>
					</div>
					<div className="form-control">
						<label className="label">
							<span className="label-text">銘柄名</span>
						</label>

						<select
							required
							className="select select-bordered w-full"
							// ref={drinkRef}
							value={drinkId}
							onChange={(val) => {
								setDrinkId(val.currentTarget.value);
								check(drinkCode, val.currentTarget.value);
							}}
							// defaultValue="0"
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

export default AddOrderModal;
