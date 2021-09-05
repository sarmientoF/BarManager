import React from "react";
import { useAppSelector } from "../app/hooks";
import PrivateContainer from "../components/common/PrivateContainer";
import UserItem from "../components/user/UserItem";

interface Props {}

const AllUsersPage = (props: Props) => {
	const customers = useAppSelector((state) => state.user.customers);

	return (
		<PrivateContainer>
			<div className="hero min-h-screen bg-base-200">
				<div className="text-center hero-content">
					<div className="">
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 place-content-center ">
							{customers.map((customer) => (
								<UserItem key={customer.uid} user={customer} />
							))}
							{customers.map((customer) => (
								<UserItem key={customer.uid} user={customer} />
							))}
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
