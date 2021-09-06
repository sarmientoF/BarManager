import React, { FC } from "react";
import { FaBeer } from "react-icons/fa";
import { IoIosNotificationsOutline } from "react-icons/io";
import { MdAccountCircle } from "react-icons/md";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
interface Props {}

const MyNavigationBar: FC<Props> = (props) => {
	const { logout } = useAuth();
	const handleSignOut = async () => {
		// return;
		await logout();
	};
	// navbar shadow-lg  bg-neutral-focus text-neutral-content
	return (
		<div className="mx-auto space-x-1 navbar max-w-none">
			<div className="px-2 mx-2 navbar-start">
				<span className="text-lg font-bold">Admin ManagerX</span>
			</div>
			<div className="hidden px-2 mx-2 navbar-center lg:flex">
				<div className="flex items-stretch">
					<Link className="btn btn-ghost btn-sm rounded-btn" to="/all">
						All
					</Link>
					<Link className="btn btn-ghost btn-sm rounded-btn" to="/online">
						Online
					</Link>
					<Link className="btn btn-ghost btn-sm rounded-btn" to="/new">
						New
					</Link>
					<Link className="btn btn-ghost btn-sm rounded-btn" to="/drinks">
						Drinks
					</Link>
					<Link className="btn btn-ghost btn-sm rounded-btn" to="/orders">
						Orders
					</Link>
				</div>
			</div>
			<div className="navbar-end">
				<button className="btn btn-square btn-ghost">
					<IoIosNotificationsOutline className="w-6 h-6" />
				</button>
				<div className="dropdown dropdown-end">
					<div tabIndex={0} className="btn btn-ghost rounded-btn">
						<MdAccountCircle className="w-6 h-6 fill-current text-info" />
					</div>

					<ul
						tabIndex={0}
						className="p-2 shadow menu dropdown-content bg-base-300 rounded-box w-52"
					>
						<li>
							<Link to="/profile">Profile</Link>
							{/* <a>Sigin out</a> */}
						</li>
						<li onClick={handleSignOut}>
							<a>Sigin out</a>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default MyNavigationBar;
