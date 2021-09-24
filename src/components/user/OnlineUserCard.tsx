import React, { useState } from "react";
import { createAvatar } from "@dicebear/avatars";
import * as style from "@dicebear/avatars-initials-sprites";
import { UserState } from "../../features/user/user-slice";

import UpdateModal from "../modals/UpdateModal";
import { updateDoc } from "@firebase/firestore";
import { database } from "../../firebase";
import { doc } from "firebase/firestore";
import AddOrderModal from "../modals/AddOrderModal";
import { useAppSelector } from "../../app/hooks";

import DeleteOrderModal from "../modals/DeleteOrderModal";

interface Props {
	user: UserState;
	showLeave?: boolean;
	canDelete?: boolean;
}

const OnlineUserCard = ({
	user,
	showLeave = false,
	canDelete = false,
}: Props) => {
	const drinks = useAppSelector((state) => state.user.drinks);

	const uid = user.uid;

	const photo =
		user.attributes.photo ||
		createAvatar(style, {
			seed: user.attributes.name,
			dataUri: true,
		});

	const [open, setOpen] = useState(false);
	const [deleteOrder, setDeleteOrder] = useState(false);
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
			{order && <AddOrderModal user={user} open={order} setOpen={setOrder} />}

			{open && <UpdateModal user={user} open={open} setOpen={setOpen} />}

			<li className="card bordered text-left bg-base-100 shadow-lg  col-span-1 rounded-lg overflow-visible  max-w-xl w-full ">
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
						className="w-16 h-16 bg-gray-300 rounded-md flex-shrink-0 object-cover shadow-lg"
						src={photo}
						alt=""
					/>
				</div>
				{user.relationships?.orders?.length != 0 ? (
					<ul className=" p-6 list-inside list-disc pt-2 border-t-2 border-base-300 flex-grow">
						{user.relationships?.orders?.map((order) => {
							const drink = drinks.find((drink) => drink.uid == order.drinkId);
							return (
								// <div key={order.orderId}>
								<li key={order.orderId} className="dropdown ">
									{canDelete && (
										<DeleteOrderModal
											order={{ uid: order.orderId, userId: user.uid }}
											open={deleteOrder}
											setOpen={setDeleteOrder}
										/>
									)}
									<div tabIndex={0} className="m-1 btn">
										{order.drinkCode} {drink?.attributes.name}
									</div>
									{canDelete && (
										<ul
											tabIndex={0}
											className="p-2 shadow menu  dropdown-content bg-base-100 rounded-box w-52"
										>
											<li>
												<button
													onClick={() => setDeleteOrder(true)}
													className="btn btn-error text-white text-lg"
												>
													削除
												</button>
											</li>
										</ul>
									)}
								</li>
							);
						})}
					</ul>
				) : (
					<div className="flex-grow border-t-2 border-base-300 place-content-center flex flex-col">
						<div className="text-center p-4 text-base-content text-opacity-50 font-semibold">
							キープない
						</div>
					</div>
				)}
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

						{showLeave && (
							<div onClick={handleInStore} className="-ml-px flex-1 flex">
								<a className="btn btn-ghost btn-block  h-full  text-lg">退店</a>
							</div>
						)}
					</div>
				</div>
			</li>
		</>
	);
};

export default OnlineUserCard;
