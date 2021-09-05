import { updateDoc, doc } from "@firebase/firestore";
import React, { FormEvent, useRef, useState } from "react";
import { useHistory } from "react-router";
import { useAppSelector } from "../app/hooks";
import PrivateContainer from "../components/common/PrivateContainer";
import { database } from "../firebase";

interface Props {}

const UpdateProfile = (props: Props) => {
	const uid = useAppSelector((state) => state.user.user.uid);
	const [loading, setLoading] = useState(false);
	const history = useHistory();
	const nameRef = useRef<HTMLInputElement>(null);
	const jobRef = useRef<HTMLInputElement>(null);
	const phoneRef = useRef<HTMLInputElement>(null);

	const handleUpdate = async () => {
		// e.preventDefault();

		const name = nameRef.current?.value || "";
		const job = jobRef.current?.value || "";
		const phone = phoneRef.current?.value || "";

		setLoading(true);
		await updateDoc(doc(database.users, uid), {
			updatedAt: database.getCurrentTimestamp(),
			"attributes.name": name,
			"attributes.phone": phone,
			"attributes.job": job,
		});

		history.push("/");
	};
	return (
		<PrivateContainer>
			<div className="hero min-h-screen bg-base-200">
				<div className="flex-col justify-center hero-content lg:flex-row">
					<div className="text-center lg:text-left">
						<h1 className="mb-5 text-5xl font-bold mx-12">Update Profile</h1>
					</div>
					<div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
						<div className="card-body">
							<div className="form-control">
								<label className="label">
									<span className="label-text">Name</span>
								</label>
								<input
									type="text"
									placeholder="name"
									className="input input-bordered"
									ref={nameRef}
								/>
							</div>
							<div className="form-control">
								<label className="label">
									<span className="label-text">Job</span>
								</label>
								<input
									type="text"
									placeholder="job"
									className="input input-bordered"
									ref={jobRef}
								/>
							</div>
							<div className="form-control">
								<label className="label">
									<span className="label-text">Phone</span>
								</label>
								<input
									type="text"
									placeholder="phone"
									className="input input-bordered"
									ref={phoneRef}
								/>
							</div>
							<div className="form-control mt-6">
								<input
									type="button"
									value="Update"
									className="btn btn-info"
									disabled={loading}
									onClick={handleUpdate}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</PrivateContainer>
	);
};

export default UpdateProfile;
