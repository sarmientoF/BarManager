import React, { useState } from "react";

import { DrinkState } from "../../features/user/user-slice";

import { BiEdit } from "react-icons/bi";

import UpdateDrinkModal from "../modals/UpdateDrinkModal";
import DeleteDrinkModal from "../modals/DeleteDrinkModal copy";

interface Props {
	drink: DrinkState;
}

const DrinkItem = ({ drink }: Props) => {
	const uid = drink.uid;

	const [open, setOpen] = useState(false);
	const [del, setDel] = useState(false);
	const [loading, setLoading] = useState(false);
	const createdAt = new Date(drink.createdAt);
	const updatedAt = new Date(drink.updatedAt);

	const isNew = createdAt.toDateString() === updatedAt.toDateString();

	const handleInStore = async () => {
		setLoading(true);
		// await updateDoc(doc(database.users, uid), {
		// 	updatedAt: database.getCurrentTimestamp(),
		// 	"attributes.isInStore": !drink.attributes.isInStore,
		// });
		setLoading(false);
	};

	return (
		<>
			<UpdateDrinkModal drink={drink} open={open} setOpen={setOpen} />
			<DeleteDrinkModal drink={drink} open={del} setOpen={setDel} />
			<div className="card bordered text-left bg-base-100 shadow-lg">
				<figure className="relative inline-flex shadow-2xl">
					<div className="flex justify-around">
						<img
							src={drink.attributes.url}
							alt=""
							className="object-cover w-full h-64"
						/>
						<button
							onClick={() => {
								setOpen(true);
							}}
							className="btn btn-accent btn-circle absolute bottom-4 right-4 shadow-lg"
						>
							<BiEdit className="fill-current w-[50%] h-[50%]" />
						</button>
					</div>
				</figure>

				<div className="card-body justify-end">
					<h2 className="card-title  justify-self-start line-clamp-1">
						{drink.attributes.name || "No name yet"}
						{/* {isNew && <div className="badge mx-2 bg-green-400">NEW</div>} */}
					</h2>
					<p className="overflow-ellipsis flex-grow overflow-hidden line-clamp-2">
						{drink.attributes.memo}
					</p>
					{/* <div className="card-actions">
						<button
							onClick={() => {
								setDel(true);
							}}
							className="btn btn-error text-white"
						>
							削除
						</button>
					</div> */}
				</div>
			</div>
		</>
	);
};

export default DrinkItem;
