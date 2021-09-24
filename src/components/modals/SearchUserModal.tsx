import React, { useRef, useState } from "react";
import { useHistory } from "react-router";
import { convertNormal } from "../../utils/Half2Kana";

interface Props {
	path: string;
	open: boolean;
	setOpen: (state: boolean) => void;
}

const SearchUserModal = ({ path, open, setOpen }: Props) => {
	const [loading, setLoading] = useState(false);

	const valueRef = useRef<HTMLInputElement>(null);
	const history = useHistory();
	const handleSearch = async () => {
		setLoading(true);
		history.push(`${path}?value=${convertNormal(valueRef.current?.value)}`);
		setLoading(false);
		setOpen(false);
	};

	const handleClose = () => {
		setOpen(false);
		setTab(false);
	};
	const [tab, setTab] = useState(false);
	return (
		<div className={`modal ${open && "modal-open"} transition-all`}>
			<span className="absolute w-full h-full" onClick={handleClose}></span>

			<div className="modal-box">
				<div className="card-body">
					<div className="form-control">
						<label className="label">
							<span className="label-text">名前など</span>
						</label>
						<input
							type="text"
							placeholder="名前,名前(カナ),会社名,その他"
							className="input input-bordered"
							ref={valueRef}
							required
						/>
					</div>
					<div className="form-control mt-4">
						<input
							type="submit"
							value="検索"
							className="btn btn-info text-white"
							disabled={loading}
							onClick={handleSearch}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SearchUserModal;
