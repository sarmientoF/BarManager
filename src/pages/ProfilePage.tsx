import { updateDoc, doc } from "@firebase/firestore";
import React, { FormEvent, useRef, useState } from "react";
import QRCode from "react-qr-code";
import { useHistory } from "react-router";
import { useAppSelector } from "../app/hooks";
import PrivateContainer from "../components/common/PrivateContainer";
import { database } from "../firebase";

interface Props {}

const ProfilePage = (props: Props) => {
	const [loading, setLoading] = useState(false);
	const {
		uid,
		attributes: { isInStore },
	} = useAppSelector((state) => state.user);

	const handleUpdate = async () => {
		setLoading(true);
		await updateDoc(doc(database.users, uid), {
			updatedAt: database.getCurrentTimestamp(),
			"attributes.isInStore": !isInStore,
		});
		setLoading(false);
		// history.push("/");
	};
	return (
		<PrivateContainer>
			<div className="hero min-h-screen bg-base-200">
				<div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100 text-center">
					<div className="text-center">
						<h1 className="my-3 text-5xl font-bold mx-12">
							My QR <br /> code
						</h1>
					</div>
					<div className="card-body place-content-center">
						<figure className="justify-center flex ">
							<QRCode value={uid} className="rounded" />
						</figure>
						<div className="justify-center card-actions">
							{isInStore ? (
								<button
									onClick={handleUpdate}
									className="btn text-white btn-info"
									disabled={loading}
								>
									Enter Store
								</button>
							) : (
								<button
									onClick={handleUpdate}
									className="btn text-white btn-error"
									disabled={loading}
								>
									Leave Store
								</button>
							)}
						</div>
					</div>
				</div>
			</div>
		</PrivateContainer>
	);
};

export default ProfilePage;
