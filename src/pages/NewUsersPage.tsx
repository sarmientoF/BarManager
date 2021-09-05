import React from "react";
import { useAppSelector } from "../app/hooks";
import PrivateContainer from "../components/common/PrivateContainer";
import StatsItem from "../components/stats/StatsItem";
import UserItem from "../components/user/UserItem";
import { UserState } from "../features/user/user-slice";
interface Props {}

const isNewUser = (user: UserState) => {
	const createdAt = new Date(user.createdAt);
	const updatedAt = new Date(user.updatedAt);
	return createdAt.toDateString() === updatedAt.toDateString();
};
const NewUsersPage = (props: Props) => {
	const customers = useAppSelector((state) => state.user.customers);
	const newCustomers = customers.filter((customer) => isNewUser(customer));
	return (
		<PrivateContainer>
			<div className="hero min-h-screen bg-base-200">
				<div className="text-center hero-content">
					<div className="">
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 place-content-center ">
							{newCustomers.map((customer) => (
								<UserItem key={customer.uid} user={customer} />
							))}
						</div>
					</div>
				</div>
			</div>
		</PrivateContainer>
	);
};

export default NewUsersPage;
