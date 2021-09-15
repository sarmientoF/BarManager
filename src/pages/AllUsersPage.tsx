import React, { useState } from "react";
import { useAppSelector } from "../app/hooks";
import PrivateContainer from "../components/common/PrivateContainer";
import SearchModal from "../components/modals/SearchModal";
import UserItem from "../components/user/UserItem";
import { useQuery } from "./drinks/DrinksPage";
import { BsSearch } from "react-icons/bs";
import SearchQRModal from "../components/modals/SearchQRModal";
import SmallUserCard from "../components/user/SmallUserCard";

interface Props {}

const AllUsersPage = (props: Props) => {
	const [page, setPage] = useState(1);
	const n = 50;
	let query = useQuery();
	const filterName = query.get("value")?.toLowerCase();
	const filterQR = query.get("qr");

	let customers = useAppSelector((state) => state.user.customers);

	if (filterName) {
		customers = customers.filter((customer) =>
			Object.values(customer.attributes).some(
				(e) => typeof e == "string" && e.toLowerCase().includes(filterName)
			)
		);
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
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-2 place-content-center items-stretch ">
						{customers.slice((page - 1) * n, page * n).map((customer) => (
							<SmallUserCard key={customer.uid} user={customer} />
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
