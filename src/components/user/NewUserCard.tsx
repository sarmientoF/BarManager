import React, { useState } from "react";
import { createAvatar } from "@dicebear/avatars";
import * as style from "@dicebear/avatars-initials-sprites";
import { UserState } from "../../features/user/user-slice";

import { BiEdit } from "react-icons/bi";
import UpdateModal from "../modals/UpdateModal";
import { updateDoc } from "@firebase/firestore";
import { database } from "../../firebase";
import { doc } from "firebase/firestore";
import AddOrderModal from "../modals/AddOrderModal";
import { useAppSelector } from "../../app/hooks";
import { MdInfoOutline } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";

interface Props {
	user: UserState;
}

const NewUserCard = ({ user }: Props) => {
	const drinks = useAppSelector((state) => state.user.drinks);

	const uid = user.uid;

	const photo =
		user.attributes.photo ||
		createAvatar(style, {
			seed: user.attributes.name,
			dataUri: true,
		});

	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [order, setOrder] = useState(false);

	const createdAt = new Date(user.createdAt);
	const updatedAt = new Date(user.updatedAt);

	const isNew = createdAt.toDateString() === updatedAt.toDateString();

	const handleEdit = () => {
		setOpen(true);
	};

	const handleAddOrder = () => {
		setOrder(true);
	};

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
			{true && <AddOrderModal user={user} open={order} setOpen={setOrder} />}

			{open && <UpdateModal user={user} open={open} setOpen={setOpen} />}
			<li className="card bordered text-left bg-base-100 shadow-lg  col-span-1 rounded-lg w-full max-w-md ">
				<div className="w-full flex items-center justify-between p-6 space-x-6">
					<div className="flex-1 truncate">
						<div className="flex items-center space-x-3">
							<h3 className="text-3xl font-medium truncate">
								{user.attributes.name}
							</h3>
						</div>
						<p className="mt-1 text-2xl truncate text-base-content text-opacity-60">
							{user.attributes.furigana}
						</p>
						<p className="mt-1 text-xl truncate text-base-content text-opacity-60">
							{user.attributes.job}
						</p>
					</div>
					<img
						className="w-20 h-20 bg-gray-300 rounded-md flex-shrink-0 object-cover shadow-lg"
						src={photo}
						alt=""
					/>
				</div>
				<div>
					<div className="-mt-px flex divide-x-2 divide-base-300 border-t-2 border-base-300">
						<div className="-ml-px w-0 flex-1 flex">
							<a
								onClick={handleEdit}
								className="btn btn-ghost btn-block h-full text-lg px-0 sm:px-4"
							>
								プロフィール
							</a>
						</div>
						<div className="w-0 flex-1 flex">
							<a
								onClick={handleAddOrder}
								className="btn btn-ghost btn-block h-full text-lg "
							>
								キープ登録
							</a>
						</div>
					</div>
				</div>
			</li>
		</>
	);
};

export default NewUserCard;
