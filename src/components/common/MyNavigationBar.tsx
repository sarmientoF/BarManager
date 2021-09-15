import React, { FC } from "react";
import { FiMenu } from "react-icons/fi";
import { IoIosNotificationsOutline } from "react-icons/io";
import { MdAccountCircle } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

enum Paths {
	ALL = "/all",
	ONLINE = "/online",
	NEW = "/new",
	DRINKS = "/drinks",
	ORDERS = "/orders",
}
const getName = (path: string) => {
	switch (path) {
		case "/all":
			return "顧客管理";
		case "/online":
			return "来店中";
		case "/new":
			return "初来店";
		case "/drinks":
			return "ボトル管理";
		case "/orders":
			return "キープ管理";
		default:
			return "Admin ManagerX";
	}
};
interface Props {}

const AllDrinks: FC = () => {
	const location = useLocation();

	return (
		<>
			<Link className="btn btn-ghost btn-sm rounded-btn" to="/all">
				顧客管理
			</Link>
			<Link className="btn btn-ghost btn-sm rounded-btn" to="/online">
				来店中
			</Link>
			<Link className="btn btn-ghost btn-sm rounded-btn" to="/new">
				初来店
			</Link>
			<Link className="btn btn-ghost btn-sm rounded-btn" to="/drinks">
				ボトル管理
			</Link>
			<Link className="btn btn-ghost btn-sm rounded-btn" to="/orders">
				キープ管理
			</Link>
		</>
	);
};
const MyNavigationBar: FC<Props> = (props) => {
	const { logout } = useAuth();
	const handleSignOut = async () => {
		// return;
		await logout();
	};
	const location = useLocation();


	return (
		<div className="mx-auto space-x-1 navbar max-w-none">
			<div className="px-2 mx-2 navbar-start">
				<span className="text-lg font-bold sr-only md:not-sr-only">
					Admin ManagerX
				</span>
				<span className="text-lg font-bold md:sr-only">
					{getName(location.pathname)}
				</span>
			</div>
			<div className="hidden px-2 mx-2 navbar-center md:flex">
				<div className="flex items-stretch">
					{Object.values(Paths).map((key) => {
						return (
							<Link
								className={`btn btn-ghost btn-sm rounded-btn ${
									location.pathname == key && "btn-active"
								}`}
								to={key}
								key={key}
							>
								{getName(key)}
							</Link>
						);
					})}
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
						<AllDrinks />
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
