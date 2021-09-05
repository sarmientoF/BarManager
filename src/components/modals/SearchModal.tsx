import React, { useRef, useState } from "react";
import { useHistory } from "react-router";

interface Props {
	open: boolean;
	setOpen: (state: boolean) => void;
}

const SearchModal = ({ open, setOpen }: Props) => {
	const [loading, setLoading] = useState(false);

	const valueRef = useRef<HTMLInputElement>(null);
	const history = useHistory();
	const handleSearch = async () => {
		setLoading(true);
		history.push(`/drinks?value=${valueRef.current?.value}`);
		setLoading(false);
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
							ref={valueRef}
							required
						/>
					</div>
					<div className="form-control mt-4">
						<input
							type="submit"
							value="Search"
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
