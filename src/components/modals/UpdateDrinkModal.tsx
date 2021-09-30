import { updateDoc } from "@firebase/firestore";
import { doc } from "firebase/firestore";
import React, { useRef, useState } from "react";
import { DrinkState, UserState } from "../../features/user/user-slice";
import { database } from "../../firebase";
import UploadImage from "../common/UploadImage";

interface Props {
	drink: DrinkState;
	open: boolean;
	setOpen: (state: boolean) => void;
}

const UpdateDrinkModal = ({ drink, open, setOpen }: Props) => {
	const uid = drink.uid;

	const nameRef = useRef<HTMLInputElement>(null);
	const memoRef = useRef<HTMLInputElement>(null);

	const [url, setUrl] = useState("");

	const [loading, setLoading] = useState(false);

	const handleUpdate = async () => {
		const name = nameRef.current?.value || "";
		const memo = memoRef.current?.value || "";
		const newUrl = url || drink.attributes.url || "";

		setLoading(true);
		await updateDoc(doc(database.drinks, uid), {
			updatedAt: database.getCurrentTimestamp(),
			"attributes.name": name,
			"attributes.memo": memo,
			"attributes.url": newUrl
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
							<span className="label-text">ボトル名</span>
						</label>
						<input
							type="text"
							placeholder="ボトル名"
							className="input input-bordered"
							defaultValue={drink.attributes.name}
							ref={nameRef}
						/>
					</div>
					<div className="form-control">
						<label className="label">
							<span className="label-text">メモ</span>
						</label>
						<input
							type="text"
							placeholder="メモ"
							className="input input-bordered"
							defaultValue={drink.attributes.memo}
							ref={memoRef}
						/>
					</div>

					<div className="form-control">
						<label className="label">
							<span className="label-text">画像</span>
						</label>
						<UploadImage setUrl={setUrl} refPath={`drinks`}  uid={uid}/>
					</div>

					<div className="form-control mt-6 flex-row justify-around space-x-1">
						<input
							type="button"
							value="更新する"
							className="btn btn-info text-white w-1/2"
							onClick={handleUpdate}
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
				</div>
			</div>
		</div>
	);
};

export default UpdateDrinkModal;
