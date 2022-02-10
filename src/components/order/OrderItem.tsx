import React, { ReactElement, useContext, useState } from "react";
import { createAvatar } from "@dicebear/avatars";
import * as style from "@dicebear/avatars-initials-sprites";

import DeleteOrderModal from "../modals/DeleteOrderModal";
import { db } from "../../firebase";
import { Order } from "../../data/data";
import { ref, update } from "firebase/database";
import { AuthContext } from "../../context/AuthContext";
interface Props {
	order: Order;
	filter: string;
}

function OrderItem({ order, filter }: Props): ReactElement {
	const [open, setOpen] = useState(false);
	const [tab, setTab] = useState(0);

	const handleRemove = async () => {
		setOpen(true);
	};

	const [loading, setLoading] = useState(false);
	const handleUse = async () => {
		setLoading(true);
		const orderRef = ref(db, `orders/${order.uid}`);
		let updates: any = {};
		updates["attributes/inUse"] = order.attributes.inUse
			? !order.attributes.inUse
			: true;
		await update(orderRef, updates);

		setLoading(false);
	};
	const {
		data: { drinks, users: customers },
	} = useContext(AuthContext);
	const drink = drinks.find((drink) => drink.uid == order.attributes.drinkId);

	const owners = customers.filter((customer) =>
		customer.relationships.orders.some((ord) => ord.orderId == order.uid)
	);

	let photo =
		owners[tab].attributes.photo ||
		createAvatar(style, {
			seed: owners[tab].attributes.name,
			dataUri: true,
		});

	if (filter) {
		if (
			!owners.some((customer) =>
				customer?.attributes.name.toLowerCase().includes(filter)
			) &&
			!owners.some((customer) =>
				customer?.attributes.furigana.includes(filter)
			) &&
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

			<li
				key={order.uid}
				className="card bordered text-left bg-base-100 shadow-lg  col-span-1 rounded-lg  "
			>
				<div className="tabs min-w-max justify-center">
					{owners.map((owner, idx) => (
						<a
							className={`tab tab-bordered ${tab == idx && "tab-active"}`}
							onClick={() => setTab(idx)}
						>
							Tab {idx}
						</a>
					))}
				</div>

				<div className="w-full flex items-center justify-between p-6 space-x-6">
					<div className="flex-1 truncate">
						<div className="flex items-center space-x-3">
							<h3 className="text-2xl font-medium truncate">
								{owners[tab].attributes.name}
							</h3>
						</div>
						<p className="mt-1 text-base truncate text-base-content text-opacity-60">
							{owners[tab].attributes.furigana}
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
					{/* <div className="flex-0 flex flex-col space-y-2"> */}
					<div className="-mt-px flex divide-x-2 divide-base-300 border-t-2 border-base-300">
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
