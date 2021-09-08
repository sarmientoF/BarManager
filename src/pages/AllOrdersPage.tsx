import React, { useState } from "react";
import { useAppSelector } from "../app/hooks";
import PrivateContainer from "../components/common/PrivateContainer";
import SearchModal from "../components/modals/SearchModal";
import UserItem from "../components/user/UserItem";
import { useQuery } from "./drinks/DrinksPage";
import { BsSearch } from "react-icons/bs";
import OrderItem from "../components/order/OrderItem";
import { Order, UserState } from "../features/user/user-slice";

interface Props {}

const AllOrdersPage = (props: Props) => {
	let query = useQuery();
	const filterName = query.get("value") || "";

	let orders = useAppSelector((state) => state.user.orders);

	const [search, setSearch] = useState(false);

	return (
		<PrivateContainer>
			<SearchModal path={"/orders"} open={search} setOpen={setSearch} />

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
							<OrderItem filter={filterName} order={order} />
						))}
					</div>
				</div>
			</div>
		</PrivateContainer>
	);
};

export default AllOrdersPage;
