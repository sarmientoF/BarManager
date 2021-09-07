import React, { useState } from "react";
import { useAppSelector } from "../app/hooks";
import PrivateContainer from "../components/common/PrivateContainer";
import SearchModal from "../components/modals/SearchModal";
import UserItem from "../components/user/UserItem";
import { useQuery } from "./drinks/DrinksPage";
import { BsSearch } from "react-icons/bs";
import SearchQRModal from "../components/modals/SearchQRModal";

interface Props {}

const AllUsersPage = (props: Props) => {
	let query = useQuery();
	const filterName = query.get("value");
	const filterQR = query.get("qr");

	let customers = useAppSelector((state) => state.user.customers);

	if (filterName) {
		customers = customers.filter((customer) =>
			customer.attributes.name.toLowerCase().includes(filterName.toLowerCase())
		);
	}

	if (filterQR) {
		customers = customers.filter((customer) => customer.uid == filterQR);
	}

	// const customers = useAppSelector((state) => state.user.customers);
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
				<div className="text-center hero-content">
					<div className="">
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 place-content-center ">
							{customers.map((customer) => (
								<UserItem key={customer.uid} user={customer} />
							))}
						</div>
					</div>
				</div>
			</div>
		</PrivateContainer>
	);
};

export default AllUsersPage;
