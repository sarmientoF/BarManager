import React, { useState } from "react";
import { createAvatar } from "@dicebear/avatars";
import * as style from "@dicebear/avatars-initials-sprites";
import { UserState } from "../../features/user/user-slice";

import { BiEdit } from "react-icons/bi";
import UpdateModal from "../modals/UpdateModal";
import { updateDoc } from "@firebase/firestore";
import { database } from "../../firebase";
import { doc } from "firebase/firestore";

interface Props {
	user: UserState;
}

const UserItem = ({ user }: Props) => {
	const uid = user.uid;

	let svg = createAvatar(style, {
		seed: user.attributes.name,
		dataUri: true,
	});

	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const createdAt = new Date(user.createdAt);
	const updatedAt = new Date(user.updatedAt);

	const isNew = createdAt.toDateString() === updatedAt.toDateString();

	const handleInStore = async () => {
		setLoading(true);
		await updateDoc(doc(database.users, uid), {
			updatedAt: database.getCurrentTimestamp(),
			"attributes.isInStore": !user.attributes.isInStore,
		});
		setLoading(false);
	};

	return (
		<>
			<UpdateModal user={user} open={open} setOpen={setOpen} />
			<div className="card bordered text-left bg-base-100 shadow-lg">
				<figure className="relative inline-flex">
					<div className="flex justify-around">
						<img src={svg} alt="" />
						<button
							onClick={() => {
								setOpen(true);
							}}
							className="btn btn-accent btn-circle absolute bottom-4 right-4 shadow-lg"
						>
							<BiEdit className="fill-current w-[50%] h-[50%]" />
						</button>
						{user.attributes.isInStore && (
							<span className="relative inline-flex rounded-md shadow-2xl">
								<span className="flex absolute h-3 w-3 top-4 right-4 -mt-1 -mr-1">
									<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-700 opacity-75"></span>
									<span className="relative inline-flex rounded-full h-3 w-3 bg-green-300"></span>
								</span>
							</span>
						)}
					</div>
				</figure>

				<div className="card-body">
					<h2 className="card-title">
						{user.attributes.name || "No name yet"}
						{isNew && <div className="badge mx-2 bg-green-400">NEW</div>}
					</h2>
					<p className="overflow-ellipsis overflow-hidden">
						Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nesciunt
						incidunt nobis molestias dolorem consequuntur laudantium?
					</p>
					<div className="card-actions">
						<button className="btn btn-accent">Add order</button>

						{user.attributes.isInStore ? (
							<button
								onClick={handleInStore}
								disabled={loading}
								className="btn btn-error text-white"
							>
								Leave
							</button>
						) : (
							<button
								onClick={handleInStore}
								disabled={loading}
								className="btn btn-info text-white"
							>
								Enter
							</button>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default UserItem;
