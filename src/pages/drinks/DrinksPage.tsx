import React, { useState } from "react";
import { useAppSelector } from "../../app/hooks";
import PrivateContainer from "../../components/common/PrivateContainer";
import DrinkModal from "../../components/modals/DrinkModal";
import { IoMdAdd } from "react-icons/io";
import DrinkItem from "../../components/drink/Drinkitem";
import { BsSearch } from "react-icons/bs";
import SearchModal from "../../components/modals/SearchDrinkModal";
import { useLocation } from "react-router";

export function useQuery() {
	return new URLSearchParams(useLocation().search);
}

interface Props {}

const DrinksPage = (props: Props) => {
	let query = useQuery();
	const filterName = query.get("value");
	let drinks = useAppSelector((state) => state.user.drinks);

	if (filterName) {
		drinks = drinks.filter((drink) =>
			drink.attributes.name.toLowerCase().includes(filterName.toLowerCase())
		);
	}
	const [open, setOpen] = useState(false);
	const [search, setSearch] = useState(false);

	return (
		<PrivateContainer>
			<DrinkModal open={open} setOpen={setOpen} />
			<SearchModal path={"/drinks"} open={search} setOpen={setSearch} />
			<div className="fixed bottom-4 right-4 z-10">
				<button
					onClick={() => {
						setOpen(true);
					}}
					className="absolute right-4 bottom-4 btn btn-info btn-circle shadow-2xl "
				>
					<IoMdAdd className="fill-current w-[70%] h-[70%] text-white" />
				</button>
				<button
					onClick={() => {
						setSearch(true);
					}}
					className="absolute right-4 bottom-20 btn btn-accent btn-circle shadow-lg"
				>
					<BsSearch className="fill-current w-[50%] h-[50%]" />
				</button>
			</div>
			<div className="hero min-h-screen bg-base-200 items-center">
				<div className="text-center w-full p-4">
					<div className="grid grid-cols-fill gap-2 place-content-center ">
						{drinks.map((drink) => (
							<DrinkItem key={drink.uid} drink={drink} />
						))}
					</div>
				</div>
			</div>
		</PrivateContainer>
	);
};

export default DrinksPage;
