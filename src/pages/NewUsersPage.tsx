import React, { useContext, useState } from "react";
import { BsSearch } from "react-icons/bs";
import PrivateContainer from "../components/common/PrivateContainer";
import SearchQRModal from "../components/modals/SearchQRModal";
import SearchUserModal from "../components/modals/SearchUserModal";
import OnlineUserCard from "../components/user/OnlineUserCard";
import { AuthContext } from "../context/AuthContext";
import { MyUser, User } from "../data/data";
import { useQuery } from "./drinks/DrinksPage";
interface Props {}

const isNewUser = (user: User) => {
	const createdAt = new Date(user.createdAt);
	const updatedAt = new Date(user.updatedAt);
	return createdAt.getTime() === updatedAt.getTime();
	// return createdAt.toLocaleDateString() == new Date().toLocaleDateString();
};
const NewUsersPage = (props: Props) => {
	const {
		data: { users: customers },
	} = useContext(AuthContext);
	let newCustomers = customers.filter((customer) => {
		return isNewUser(customer);
	});

	let query = useQuery();

	const filterName = query.get("value")?.toLowerCase();
	const filterQR = query.get("qr");

	if (filterName) {
		newCustomers = newCustomers.filter((customer) => {
			const isDrink = customer.relationships?.orders?.filter((order) =>
				order.drinkCode.includes(filterName)
			).length;
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
		newCustomers = customers.filter((customer) => customer.uid == filterQR);
	}
	const [search, setSearch] = useState(false);

	return (
		<PrivateContainer>
			<SearchQRModal path={"/new"} open={search} setOpen={setSearch} />
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
					{/* <div className="grid grid-cols-1  gap-2  place-content-center items-stretch "> */}
					<div className="grid grid-cols-1  gap-2 justify-items-center ">
						{newCustomers.map((customer) => (
							<OnlineUserCard key={customer.uid} user={customer} />
						))}
					</div>
				</div>
			</div>
		</PrivateContainer>
	);
};

export default NewUsersPage;
