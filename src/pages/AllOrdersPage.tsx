import React, { useState } from "react";
import { useAppSelector } from "../app/hooks";
import PrivateContainer from "../components/common/PrivateContainer";
import SearchDrinkModal from "../components/modals/SearchDrinkModal";
import UserItem from "../components/user/UserItem";
import { useQuery } from "./drinks/DrinksPage";
import { BsSearch } from "react-icons/bs";
import OrderItem from "../components/order/OrderItem";

interface Props {}

const AllOrdersPage = (props: Props) => {
	let query = useQuery();
	const filterName = query.get("value") || "";

	let orders = useAppSelector((state) => state.user.orders);

	const [search, setSearch] = useState(false);

	return (
		<PrivateContainer>
			<SearchDrinkModal various path={"/orders"} open={search} setOpen={setSearch} />

			<div className="fixed bottom-4 right-4 z-10">
				<button
					onClick={() => {
						setSearch(true);
					}}
					className="btn btn-accent btn-circle shadow-lg"
				>
					<BsSearch className="fill-current w-[50%] h-[50%]" />
				</button>
			</div>
			<div className="hero min-h-screen bg-base-200">
				<div className="text-center w-full p-4">
					<div className="grid grid-cols-fill2 gap-4 place-content-center">
						{orders.map((order) => (
							<OrderItem key={order.uid} filter={filterName} order={order} />
						))}
					</div>
				</div>
			</div>
		</PrivateContainer>
	);
};

export default AllOrdersPage;
