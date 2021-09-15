import React from "react";
import { useAppSelector } from "../app/hooks";
import PrivateContainer from "../components/common/PrivateContainer";
import OnlineUserCard from "../components/user/OnlineUserCard";
import UserItem from "../components/user/UserItem";

interface Props {}

const OnlineUsersPage = (props: Props) => {
	const customers = useAppSelector((state) => state.user.customers);
	const onlineCustomers = customers.filter(
		(customer) => customer.attributes.isInStore
	);

	return (
		<PrivateContainer>
			<div className="hero min-h-screen bg-base-200">
				<div className="text-center w-full p-4 place-content-center">
					<div className="grid grid-cols-1 lg:grid-cols-2  gap-2 place-content-center ">
						{onlineCustomers.map((customer) => (
							<OnlineUserCard key={customer.uid} user={customer} />
						))}
					</div>
				</div>
			</div>
		</PrivateContainer>
	);
};

export default OnlineUsersPage;
