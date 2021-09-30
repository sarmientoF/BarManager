import React, { useContext, useState } from "react";
import PrivateContainer from "../components/common/PrivateContainer";

import { useQuery } from "./drinks/DrinksPage";
import { BsSearch } from "react-icons/bs";
import SearchQRModal from "../components/modals/SearchQRModal";
import OnlineUserCard from "../components/user/OnlineUserCard";
import { AuthCotnext } from "../context/AuthContext";

interface Props {}

const AllUsersPage = (props: Props) => {
	const [page, setPage] = useState(1);
	const n = 30;
	let query = useQuery();
	const filterName = query.get("value")?.toLowerCase();
	const filterQR = query.get("qr");

	let {
		data: { users: customers },
	} = useContext(AuthCotnext);

	if (filterName) {
		customers = customers.filter((customer) => {
			const isDrink = customer.relationships?.orders?.filter((order) => {
				return order.drinkCode.includes(filterName);
			}).length;
			const isAttribute = Object.values({
				...customer.attributes,
				photo: "",
			}).some(
				(e) => typeof e == "string" && e.toLowerCase().includes(filterName)
			);

			return isDrink || isAttribute;
		});
	}

	if (filterQR) {
		customers = customers.filter((customer) => customer.uid == filterQR);
	}

	const pages = Math.ceil(customers.length / n);

	const [search, setSearch] = useState(false);

	return (
		<PrivateContainer>
			<SearchQRModal path={"/all"} open={search} setOpen={setSearch} />

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
					<div className="grid grid-cols-1 gap-2  justify-items-center ">
						{customers.slice((page - 1) * n, page * n).map((customer) => (
							<OnlineUserCard key={customer.uid} user={customer} />
						))}
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

export default AllUsersPage;
