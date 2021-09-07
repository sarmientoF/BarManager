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
interface Props {
	user: UserState;
}

const UserItem = ({ user }: Props) => {
	const drinks = useAppSelector((state) => state.user.drinks);

	const uid = user.uid;

	let svg = createAvatar(style, {
		seed: user.attributes.name,
		dataUri: true,
	});

	const photo = user.attributes.photo || svg;

	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [order, setOrder] = useState(false);

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

	const handleAddOrder = () => {
		setOrder(true);
	};

	return (
		<>
			{true && <AddOrderModal user={user} open={order} setOpen={setOrder} />}

			{open && <UpdateModal user={user} open={open} setOpen={setOpen} />}
			<div className="card bordered text-left bg-base-100 shadow-lg">
				<figure className="relative inline-flex">
					<div className="flex justify-around">
						<img src={photo} className="object-cover w-full h-64" alt="" />
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
					<div className="card-actions -mx-0.5">
						<button onClick={handleAddOrder} className="btn btn-accent">
							キープ登録
						</button>

						{user.attributes.isInStore ? (
							<button
								onClick={handleInStore}
								disabled={loading}
								className="btn btn-error text-white"
							>
								退店
							</button>
						) : (
							<button
								onClick={handleInStore}
								disabled={loading}
								className="btn btn-info text-white"
							>
								入店
							</button>
						)}
					</div>
					<div tabIndex={0} className="collapse -mx-3.5">
						<div className="collapse-title flex text-xl font-medium overflow-hidden">
							<div className="max-w-[80%] overflow-hidden line-clamp-1 ">
								{user.attributes.name}
							</div>
							{isNew && <div className="badge ml-2 bg-green-400">NEW</div>}
							<MdInfoOutline className="inline-flex ml-2 fill-current text-green-500 " />
						</div>
						<div className="collapse-content">
							<p>{user.attributes.furigana}</p>
							<p>{user.attributes.job}</p>
							<ul className="list-inside list-disc">
								{user.relationships?.orders?.map((order) => {
									const drink = drinks.find(
										(drink) => drink.uid == order.drinkId
									);
									return (
										<li key={order.orderId}>
											{order.drinkCode} {drink?.attributes.name}
										</li>
									);
								})}
							</ul>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default UserItem;
