import { signInWithEmailLink, User } from "@firebase/auth";
import { isSignInWithEmailLink, sendSignInLinkToEmail } from "firebase/auth";
import {
	collection,
	doc,
	DocumentData,
	getDoc,
	getDocs,
	onSnapshot,
	query,
	setDoc,
} from "firebase/firestore";
import React, { FC, useContext, useEffect } from "react";
import { useState } from "react";
import { useAppDisptach } from "../app/hooks";
import {
	UserState,
	watchDrinks,
	watchOrders,
	watchUsers,
} from "../features/user/user-slice";
import { auth, database, db } from "../firebase";
import { watchUser } from "../features/user/user-slice";
import { userConverter, UserData } from "./DataConverter";
import { drinkConverter, DrinkData } from "./DrinkConverter";
import { orderConverter, OrderData } from "./OrderConverter";

const AuthCotnext = React.createContext({
	currentUser: null as User | null,
	signInWithLink: {} as () => Promise<boolean>,
	sendSignInLink: {} as (email: string) => Promise<void>,
	logout: {} as () => Promise<void>,
});

export const useAuth = () => {
	return useContext(AuthCotnext);
};

const actionCodeSettings = {
	// url: "http://localhost:3000/verify_signin",
	url: "https://admin-barmanagerx.web.app/verify_signin",
	handleCodeInApp: true,
};

interface Props {}
export const AuthProvider: FC<Props> = (props) => {
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const dispatch = useAppDisptach();

	const signInWithLink = async () => {
		if (isSignInWithEmailLink(auth, window.location.href)) {
			let email = window.localStorage.getItem("emailForSignIn");
			if (!email) {
				email = window.prompt("Please provide your email for confirmation");
			}
			if (!email) return false;
			try {
				const querySnapshot = await getDocs(collection(db, "managers"));
				let path = "";
				querySnapshot.forEach((doc) => {
					const emails = doc.data().emails;
					if (emails.includes(email)) path = doc.id;
				});

				if (!path) return false;

				const {
					user: { uid },
				} = await signInWithEmailLink(auth, email, window.location.href);
				window.localStorage.removeItem("emailForSignIn");

				const userRef = doc(db, path, "uid");
				const userSnap = await getDoc(userRef);
				if (!userSnap.exists()) {
					console.log("🚨 No such document!");

					await setDoc(doc(db, path, uid), {
						createdAt: database.getCurrentTimestamp(),
						updatedAt: database.getCurrentTimestamp(),
						// "attributes.path": path,
						uid: uid,
					});
				}
				return true;
			} catch (e) {
				console.log(e);
				return false;
			}
		}
		return false;
	};

	const sendSignInLink = (email: string) => {
		return sendSignInLinkToEmail(auth, email, actionCodeSettings);
	};

	const logout = () => {
		return auth.signOut();
	};
	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((user) => {
			setCurrentUser(user);
			setLoading(false);
		});
		return unsubscribe;
	}, []);

	useEffect(() => {
		if (currentUser) {
			onSnapshot(
				doc(db, "admins", currentUser.uid).withConverter(userConverter),
				(doc) => {
					let data = doc.data();

					const source = doc.metadata.hasPendingWrites ? "Local" : "Server";
					if (data) {
						let payload = {
							...data,
						};

						dispatch(watchUser(payload as any));
					}
				}
			);

			const customersQuery = query(collection(db, "users")).withConverter(
				userConverter
			);

			onSnapshot(customersQuery, (querySnapshot) => {
				const users: UserData[] = [];
				querySnapshot.forEach((doc) => {
					users.push(doc.data());
				});

				dispatch(watchUsers(users as any));
			});
			const drinksQuery = query(collection(db, "drinks")).withConverter(
				drinkConverter
			);

			onSnapshot(drinksQuery, (querySnapshot) => {
				const drinks: DrinkData[] = [];
				querySnapshot.forEach((doc) => {
					drinks.push(doc.data());
				});

				dispatch(watchDrinks(drinks as any));
			});

			const ordersQuery = query(collection(db, "orders")).withConverter(
				orderConverter
			);
			onSnapshot(ordersQuery, (querySnapshot) => {
				const orders: OrderData[] = [];
				querySnapshot.forEach((doc) => {
					orders.push({ ...doc.data(), uid: doc.id });
				});

				dispatch(watchOrders(orders as any));
			});
		}
	}, [currentUser]);

	const context = {
		currentUser,
		signInWithLink,
		sendSignInLink,
		logout,
	};
	return (
		<AuthCotnext.Provider value={context}>
			{!loading && props.children}
		</AuthCotnext.Provider>
	);
};
