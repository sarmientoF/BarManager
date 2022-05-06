import React, { useContext, useState } from "react";
import PrivateContainer from "../components/common/PrivateContainer";
import SearchDrinkModal from "../components/modals/SearchDrinkModal";
import { useQuery } from "./drinks/DrinksPage";
import { BsSearch } from "react-icons/bs";
import OrderItem from "../components/order/OrderItem";
import { AuthContext } from "../context/AuthContext";

interface Props {}

const AllOrdersPage = (props: Props) => {
	const [page, setPage] = useState(1);
	let n = 30;

	let query = useQuery();
	const filterName = query.get("value") || "";

	let {
		data: { orders },
	} = useContext(AuthContext);
	// Sort the orders by drinkCode
	orders = orders.sort((a, b) => {
		if (parseInt(a.attributes.drinkCode) < parseInt(b.attributes.drinkCode)) {
			return -1;
		}
		if (parseInt(a.attributes.drinkCode) > parseInt(b.attributes.drinkCode)) {
			return 1;
		}
		return 0;
	});
	let pages = Math.ceil(orders.length / n);
	if (filterName) {
		pages = 1;
		n = orders.length;
	}
	const [search, setSearch] = useState(false);
	return (
		<PrivateContainer>
			<SearchDrinkModal
				various
				path={"/orders"}
				open={search}
				setOpen={setSearch}
			/>
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
						{orders.slice((page - 1) * n, page * n).map((order) => {
							return (
								<OrderItem key={order.uid} filter={filterName} order={order} />
							);
						})}
					</div>
					<div className="btn-group w-full flex justify-center pt-8">
						<button
							onClick={() => {
								setPage(Math.max(1, page - 1));
							}}
							className="btn"
						>
							Previous
						</button>
						<button className={`btn  btn-accent`}>
							{page}/{pages}
						</button>
						<button
							onClick={() => {
								setPage(Math.min(page + 1, pages));
							}}
							className="btn"
						>
							Next
						</button>
					</div>
				</div>
			</div>
		</PrivateContainer>
	);
};

export default AllOrdersPage;
