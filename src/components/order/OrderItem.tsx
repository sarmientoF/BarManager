import React, { ReactElement, useState } from "react";
import { OrderState } from "../../features/user/user-slice";
import { createAvatar } from "@dicebear/avatars";
import * as style from "@dicebear/avatars-initials-sprites";
import { useAppSelector } from "../../app/hooks";

import DeleteOrderModal from "../modals/DeleteOrderModal";
interface Props {
	order: OrderState;
	filter: string;
}

function OrderItem({ order, filter }: Props): ReactElement {
	const [open, setOpen] = useState(false);
	const handleRemove = async () => {
		setOpen(true);
	};
	const { drinks, customers } = useAppSelector((state) => state.user);
	const drink = drinks.find((drink) => drink.uid == order.attributes.drinkId);

	const customer = customers.find(
		(customer) => customer.uid == order.attributes.userId
	);

	let svg =
		customer?.attributes.photo ||
		createAvatar(style, {
			seed: customer!.attributes.name,
			dataUri: true,
		});

	if (filter) {
		if (
			!customer?.attributes.name.toLowerCase().includes(filter) &&
			!order.attributes.drinkCode.includes(filter)
		) {
			return <></>;
		}
	}

	return (
		<>
			<DeleteOrderModal order={order} open={open} setOpen={setOpen} />
			<div className="card shadow-lg compact side bg-base-100 ">
				<div className="flex-row items-center space-x-4 card-body text-left">
					<div>
						<div className="avatar">
							<div className="rounded-full w-14 h-14 shadow">
								<img src={svg} />
							</div>
						</div>
					</div>
					<div className="flex-1">
						<h2 className="card-title line-clamp-1">
							{customer?.attributes.name}
						</h2>
						<p className="card-title line-clamp-1">{drink?.attributes.name}</p>
						<p className="text-base-content text-opacity-40">
							{order.attributes.drinkCode}
						</p>
					</div>
					<div className="flex-0">
						<button onClick={handleRemove} className="btn btn-sm bg-red-500">
							削除
						</button>
					</div>
				</div>
			</div>
		</>
	);
}

export default OrderItem;
