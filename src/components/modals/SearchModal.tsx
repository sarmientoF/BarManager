import React, { useRef, useState } from "react";
import { useHistory } from "react-router";

interface Props {
	path: string;
	open: boolean;
	setOpen: (state: boolean) => void;
	various?: boolean;
}

const SearchModal = ({ path, open, setOpen, various = false }: Props) => {
	const [loading, setLoading] = useState(false);

	const valueRef = useRef<HTMLInputElement>(null);
	const history = useHistory();
	const handleSearch = async () => {
		setLoading(true);
		history.push(`${path}?value=${valueRef.current?.value}`);
		setLoading(false);
		setOpen(false);
	};

	const handleClose = () => {
		setOpen(false);
	};
	return (
		<div className={`modal ${open && "modal-open"} transition-all`}>
			<span className="absolute w-full h-full" onClick={handleClose}></span>

			<div className="modal-box">
				<div className="card-body">
					<div className="form-control">
						<label className="label">
							<span className="label-text">{various ? "名前など": "名前"}</span>
						</label>
						<input
							type="text"
							placeholder={various ? "ボトル番号、名前、銘柄名" : "名前"}
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

export default SearchModal;
