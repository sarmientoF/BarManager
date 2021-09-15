import React from "react";
import { useAppSelector } from "../app/hooks";
import PrivateContainer from "../components/common/PrivateContainer";
import StatsItem from "../components/stats/StatsItem";
import NewUserCard from "../components/user/NewUserCard";
import UserItem from "../components/user/UserItem";
import { UserState } from "../features/user/user-slice";
interface Props {}

const isNewUser = (user: UserState) => {
	const createdAt = new Date(user.createdAt);
	const updatedAt = new Date(user.updatedAt);
	return createdAt.getTime() === updatedAt.getTime();
};
const NewUsersPage = (props: Props) => {
	const customers = useAppSelector((state) => state.user.customers);
	const newCustomers = customers.filter((customer) => {
		return isNewUser(customer);
	});
	return (
		<PrivateContainer>
			<div className="hero min-h-screen bg-base-200">
				<div className="text-center w-full p-4">
					<div className="grid grid-cols-1  gap-2 justify-items-center">
						{newCustomers.map((customer) => (
							<NewUserCard key={customer.uid} user={customer} />
						))}
					</div>
				</div>
			</div>
		</PrivateContainer>
	);
};

export default NewUsersPage;
