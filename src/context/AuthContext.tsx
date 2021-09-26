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
	updateDoc,
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

const initialState = {
	currentUser: null as User | null,
	isAdmin: false,
	signInWithLink: {} as () => Promise<{
		success: boolean;
		message: string;
	}>,
	sendSignInLink: {} as (email: string) => Promise<{
		message: string;
		success: boolean;
	}>,
	logout: {} as () => Promise<void>,
};
export const AuthCotnext = React.createContext(initialState);

export const useAuth = () => {
	return useContext(AuthCotnext);
};

const actionCodeSettings = {
	url: "http://localhost:3000/verify_signin",
	// url: "https://admin-barmanagerx.web.app/verify_signin",
	handleCodeInApp: true,
};

interface Props {}
export const AuthProvider: FC<Props> = (props) => {
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [isAdmin, setisAdmin] = useState(initialState.isAdmin);
	const dispatch = useAppDisptach();

	const signInWithLink = async () => {
		if (isSignInWithEmailLink(auth, window.location.href)) {
			let email = window.localStorage.getItem("emailForSignIn");
			if (!email) {
				email = window.prompt("Please provide your email for confirmation");
			}
			if (!email) return { success: false, message: "🚨 メールが有効でない" };
			try {
				const userSnap = await getDoc(doc(db, "roles", email));

				if (userSnap.exists()) {
					const {
						user: { uid },
					} = await signInWithEmailLink(auth, email, window.location.href);
					window.localStorage.removeItem("emailForSignIn");

					try {
						const adminSnap = await getDoc(doc(db, "admins", uid));
						if (!adminSnap.exists()) {
							await setDoc(doc(db, "admins", uid), {
								createdAt: database.getCurrentTimestamp(),
								updatedAt: database.getCurrentTimestamp(),
								uid: uid,
							});
						}
						return { success: true, message: "ログイン成功" };
					} catch (e) {
						return { success: false, message: "🚨 サーバーエラー" };
					}
				}
				return { success: false, message: "スタッフとして登録されていない" };
			} catch (e) {
				console.log(e);
				return { success: false, message: "🚨 サーバーエラー" };
			}
		}
		return { success: false, message: "🚨 リンクが有効でない" };
	};

	const sendSignInLink = async (email: string) => {
		const userSnap = await getDoc(doc(db, "roles", email));
		if (userSnap.exists()) {
			try {
				await sendSignInLinkToEmail(auth, email, actionCodeSettings);
				return { message: "送信成功", success: true };
			} catch (error) {
				return { message: "メールが送れない", success: false };
			}
		}
		return { message: "スタッフとして登録されていない", success: false };
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
			if (currentUser.email) {
				onSnapshot(doc(db, "roles", currentUser.email), (doc) => {
					let data = doc.data();
					if (data) {
						setisAdmin(data.isAdmin);
					}
				});
			}

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
		isAdmin,
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
