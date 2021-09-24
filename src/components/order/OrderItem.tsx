import React, { ReactElement, useState } from "react";
import { OrderState } from "../../features/user/user-slice";
import { createAvatar } from "@dicebear/avatars";
import * as style from "@dicebear/avatars-initials-sprites";
import { useAppSelector } from "../../app/hooks";

import DeleteOrderModal from "../modals/DeleteOrderModal";
import { doc, updateDoc } from "@firebase/firestore";
import { db } from "../../firebase";
interface Props {
	order: OrderState;
	filter: string;
}

function OrderItem({ order, filter }: Props): ReactElement {
	const [open, setOpen] = useState(false);
	const handleRemove = async () => {
		setOpen(true);
	};
	const [loading, setLoading] = useState(false);
	const handleUse = async () => {
		setLoading(true);
		const orderRef = doc(db, "orders", order.uid);
		await updateDoc(orderRef, {
			"attributes.inUse": order.attributes.inUse
				? !order.attributes.inUse
				: true,
		});

		setLoading(false);
	};
	const { drinks, customers } = useAppSelector((state) => state.user);
	const drink = drinks.find((drink) => drink.uid == order.attributes.drinkId);

	const customer = customers.find(
		(customer) => customer.uid == order.attributes.userId
	);

	let photo =
		customer?.attributes.photo ||
		createAvatar(style, {
			seed: customer!.attributes.name,
			dataUri: true,
		});

	if (filter) {
		if (
			!customer?.attributes.name.toLowerCase().includes(filter) &&
			!customer?.attributes.furigana.includes(filter) &&
			!order.attributes.drinkCode.includes(filter) &&
			!drink?.attributes.name.includes(filter)
		) {
			return <></>;
		}
	}

	return (
		<>
			<DeleteOrderModal
				order={{ uid: order.uid, userId: order.attributes.userId }}
				open={open}
				setOpen={setOpen}
			/>
			<li className="card bordered text-left bg-base-100 shadow-lg  col-span-1 rounded-lg  ">
				<div className="w-full flex items-center justify-between p-6 space-x-6">
					<div className="flex-1 truncate">
						<div className="flex items-center space-x-3">
							<h3 className="text-2xl font-medium truncate">
								{customer?.attributes.name}
							</h3>
						</div>
						<p className="mt-1 text-base truncate text-base-content text-opacity-60">
							{customer?.attributes.furigana}
						</p>
						<p className="mt-1 text-2xl truncate text-base-content text-opacity-60">
							{drink?.attributes.name}
						</p>

						<p className="mt-1 text-2xl truncate text-base-content text-opacity-60">
							{order.attributes.drinkCode}
						</p>
					</div>
					<img
						className="w-16 h-16 bg-gray-300 rounded-md flex-shrink-0 object-cover shadow-lg"
						src={photo}
						alt=""
					/>
				</div>

				<div>
					<div className="-mt-px flex divide-x-2 divide-base-300 border-t-2 border-base-300">
						<div className="-ml-px w-0 flex-1 flex">
							{order.attributes.inUse ? (
								<a
									onClick={handleUse}
									className="btn btn-ghost btn-block h-full text-lg px-0 sm:px-4"
								>
									使用しない
								</a>
							) : (
								<a
									onClick={handleUse}
									className="btn btn-ghost btn-block h-full text-lg px-0 sm:px-4"
								>
									使用する
								</a>
							)}
						</div>
						<div className="w-0 flex-1 flex">
							<a
								onClick={handleRemove}
								className="btn btn-ghost btn-block h-full text-lg "
							>
								削除
							</a>
						</div>
					</div>
				</div>
			</li>

			{/* <div className="card shadow-lg compact side bg-base-100">
				<div className="flex-row items-center space-x-4 card-body text-left">
					<div>
						<div className="avatar">
							<div className="rounded-lg w-20 h-20 shadow">
								<img src={svg} />
							</div>
						</div>
					</div>
					<div className="flex-1">
						<h2 className="card-title line-clamp-1 text-2xl">
							{customer?.attributes.name}
						</h2>
						<p className="card-title line-clamp-1 text-2xl">
							{drink?.attributes.name}
						</p>
						<p className="text-base-content text-opacity-40 text-2xl">
							{order.attributes.drinkCode}
						</p>
					</div>
					<div className="flex-0 flex flex-col space-y-2">
						{order.attributes.inUse ? (
							<button
								onClick={handleUse}
								className={`btn btn-accent text-lg ${
									loading && "btn-disabled"
								}`}
							>
								使用しない
							</button>
						) : (
							<button
								onClick={handleUse}
								className={`btn btn-accent text-lg ${
									loading && "btn-disabled"
								}`}
							>
								使用する
							</button>
						)}
						<button onClick={handleRemove} className="btn bg-red-500 text-xl">
							削除
						</button>
					</div>
				</div>
			</div> */}
		</>
	);
}

export default OrderItem;
