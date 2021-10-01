import React, { useRef, useState } from "react";
import { db } from "../../firebase";
import UploadImage from "../common/UploadImage";
import { v4 as uuid } from "uuid";
import { ref, set } from "firebase/database";

interface Props {
	open: boolean;
	setOpen: (state: boolean) => void;
}

const DrinkModal = ({ open, setOpen }: Props) => {
	const [loading, setLoading] = useState(false);
	const [files, setFiles] = useState<any>([]);
	const [url, setUrl] = useState("");
	const [newDrinkRef, setNewDrinkRef] = useState(uuid());

	const drinkNameRef = useRef<HTMLInputElement>(null);

	const handleCreate = async () => {
		setLoading(true);
		const drinkName = drinkNameRef.current?.value;

		if (!url || !drinkName) return;
		const date = new Date().toISOString();
		setLoading(true);
		await set(ref(db, `drinks/${newDrinkRef}`), {
			attributes: {
				name: drinkName,
				url: url,
			},
			createdAt: date,
			updatedAt: date,
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
						<UploadImage setUrl={setUrl} refPath="drinks" uid={newDrinkRef} />
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
