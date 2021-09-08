import React from "react";
import { useAppSelector } from "../app/hooks";
import PrivateContainer from "../components/common/PrivateContainer";
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
					<div className="grid grid-cols-fill  gap-2 place-content-center ">
						{onlineCustomers.map((customer) => (
							<UserItem key={customer.uid} user={customer} />
						))}
					</div>
				</div>
			</div>
		</PrivateContainer>
	);
};

export default OnlineUsersPage;
