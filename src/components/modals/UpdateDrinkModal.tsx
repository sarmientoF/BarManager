import { ref, update } from "firebase/database";
import React, { useRef, useState } from "react";
import { Bottle } from "../../data/data";
import { db } from "../../firebase";
import UploadImage from "../common/UploadImage";

interface Props {
	drink: Bottle;
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
		let updates: any = {};
		updates["updatedAt"] = new Date().toISOString();
		updates["attributes/name"] = name;
		updates["attributes/memo"] = memo;
		updates["attributes/url"] = newUrl;
		await update(ref(db, `bottles/${uid}`), updates);
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
						<UploadImage setUrl={setUrl} refPath={`drinks`} uid={uid} />
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
