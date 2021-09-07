import { collection, doc, setDoc } from "firebase/firestore";
import React, { useRef, useState } from "react";
import { database, db } from "../../firebase";
import UploadImage from "../common/UploadImage";

interface Props {
	open: boolean;
	setOpen: (state: boolean) => void;
}

const DrinkModal = ({ open, setOpen }: Props) => {
	const [loading, setLoading] = useState(false);
	const [files, setFiles] = useState<any>([]);
	const [url, setUrl] = useState("");

	const drinkNameRef = useRef<HTMLInputElement>(null);

	const handleCreate = async () => {
		setLoading(true);
		const drinkName = drinkNameRef.current?.value;
		if (!url || !drinkName) return;
		const newDrinkRef = doc(collection(db, "drinks"));
		setLoading(true);
		await setDoc(newDrinkRef, {
			attributes: {
				name: drinkName,
				url: url,
			},
			createdAt: database.getCurrentTimestamp(),
			updatedAt: database.getCurrentTimestamp(),
			uid: newDrinkRef.id,
		});
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
							ref={drinkNameRef}
							required
						/>
					</div>
					<div className="form-control">
						<label className="label">
							<span className="label-text">画像</span>
						</label>
						<UploadImage setUrl={setUrl} refPath="images" />
					</div>
					<div className="form-control mt-4">
						<input
							type="submit"
							value="ボトルを追加する"
							className="btn btn-info text-white"
							disabled={loading || !url}
							onClick={handleCreate}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DrinkModal;
