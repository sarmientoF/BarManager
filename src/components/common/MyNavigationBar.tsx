import React, { FC, useContext } from "react";
import { FiMenu } from "react-icons/fi";
import { IoIosNotificationsOutline } from "react-icons/io";
import { MdAccountCircle } from "react-icons/md";
import { useStore } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { AuthCotnext, useAuth } from "../../context/AuthContext";

export const my_paths = [
	{
		ref: "/all",
		tag: "顧客管理",
	},
	{
		ref: "/online",
		tag: "来店中",
	},
	{
		ref: "/new",
		tag: "初来店",
	},
	{
		ref: "/drinks",
		tag: "ボトル管理",
	},
	{
		ref: "/orders",
		tag: "キープ管理",
	},
	{
		ref: "/add",
		tag: "スタッフ管理",
	},
];

interface AllDrinksProps {
	paths: {
		ref: string;
		tag: string;
	}[];
}

const AllDrinks: FC<AllDrinksProps> = ({ paths }) => {
	const location = useLocation();

	return (
		<>
			{paths.map((path) => (
				<Link
					key={path.ref}
					className="btn btn-ghost btn-sm rounded-btn"
					to={path.ref}
				>
					{path.tag}
				</Link>
			))}
		</>
	);
};
interface Props {}
const MyNavigationBar: FC<Props> = (props) => {
	const { logout } = useAuth();
	const handleSignOut = async () => {
		// return;
		await logout();
	};
	const location = useLocation();

	const me = useAppSelector((state) => state.user.user);
	const { isAdmin } = useContext(AuthCotnext);

	const paths = !isAdmin ? my_paths.slice(1, -1) : my_paths;

	return (
		<div className="mx-auto space-x-1 navbar max-w-none">
			<div className="px-2 mx-2 navbar-start">
				<Link className="text-lg font-bold sr-only md:not-sr-only" to={"/"}>
					Admin ManagerX
				</Link>
				<span className="text-lg font-bold md:sr-only">
					{paths.find((path) => path.ref == location.pathname)?.tag ||
						"Admin ManagerX"}
				</span>
			</div>
			<div className="hidden px-2 mx-2 navbar-center md:flex">
				<div className="flex items-stretch">
					{paths.map((path) => (
						<Link
							className={`btn btn-ghost btn-sm rounded-btn ${
								location.pathname == path.ref && "btn-active"
							}`}
							to={path.ref}
							key={path.tag}
						>
							{path.tag}
						</Link>
					))}
				</div>
			</div>
			<div className="navbar-end">
				<div className="dropdown dropdown-end md:sr-only">
					<div tabIndex={0} className="btn btn-ghost rounded-btn">
						<FiMenu className="w-6 h-6 fill-current text-info" />
					</div>

					<ul
						tabIndex={0}
						className="p-2 shadow menu dropdown-content bg-base-300 rounded-box w-52"
					>
						<AllDrinks paths={paths} />
					</ul>
				</div>
				<div className="dropdown dropdown-end">
					<div tabIndex={0} className="btn btn-ghost rounded-btn">
						<MdAccountCircle className="w-6 h-6 fill-current text-info" />
					</div>

					<ul
						tabIndex={0}
						className="p-2 shadow menu dropdown-content bg-base-300 rounded-box w-52"
					>
						<li onClick={handleSignOut}>
							<a>ログアウト</a>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default MyNavigationBar;
