import { ref, update } from "firebase/database";
import React, { useRef, useState } from "react";
import QrReader from "react-qr-reader";
import { useHistory } from "react-router";
import { db } from "../../firebase";

interface Props {
	path: string;
	open: boolean;
	setOpen: (state: boolean) => void;
}

const SearchQRModal = ({ path, open, setOpen }: Props) => {
	const [loading, setLoading] = useState(false);

	const valueRef = useRef<HTMLInputElement>(null);
	const history = useHistory();
	const handleSearch = async () => {
		setLoading(true);
		history.push(`${path}?value=${valueRef.current?.value}`);
		setLoading(false);
		setOpen(false);
	};

	const handleOnScan = async (data: string | null) => {
		if (data) {
			// console.log("Data", data);

			let updates: any = {};
			updates["updatedAt"] = new Date().toISOString();
			updates["attributes/isInStore"] = true;
			await update(ref(db, `users/${data}`), updates);
			history.push(`${path}?qr=${data}`);
			handleClose();
		}
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
					<div className="flex">
						<div className="tabs tabs-boxed">
							<div
								onClick={() => {
									setTab(false);
								}}
								className={"tab " + (!tab && "tab-active")}
							>
								ććăȘă©
							</div>
							<div
								onClick={() => {
									setTab(true);
								}}
								className={"tab " + (tab && "tab-active")}
							>
								QR
							</div>
						</div>
					</div>
					{tab ? (
						<div className="rounded-2xl pt-4">
							<QrReader
								delay={300}
								onError={() => {}}
								onScan={handleOnScan}
								style={{ width: "100%" }}
							/>
						</div>
					) : (
						<>
							<div className="form-control">
								<label className="label">
									<span className="label-text">ććăȘă©</span>
								</label>
								<input
									type="text"
									placeholder="ćć,ćć(ă«ă),äŒç€Ÿć,ăăźä»"
									className="input input-bordered"
									ref={valueRef}
									required
								/>
							</div>
							<div className="form-control mt-4">
								<input
									type="submit"
									value="æ€çŽą"
									className="btn btn-info text-white"
									disabled={loading}
									onClick={handleSearch}
								/>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default SearchQRModal;
