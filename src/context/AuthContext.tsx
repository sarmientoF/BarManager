import { signInWithEmailLink, User } from "@firebase/auth";
import { isSignInWithEmailLink, sendSignInLinkToEmail } from "firebase/auth";
import {
	child,
	get,
	limitToLast,
	onChildAdded,
	onChildChanged,
	onChildRemoved,
	onValue,
	orderByChild,
	orderByValue,
	query,
	ref,
	set,
	startAt,
} from "firebase/database";
import React, { FC, useCallback, useContext, useEffect } from "react";
import { useState } from "react";
import {
	AllData,
	Bottle,
	MyBottle,
	MyOrder,
	MyUser,
	Order,
	Roles,
	StoreData,
} from "../data/data";

import { auth, db, dbRef } from "../firebase";

const initialState = {
	currentUser: null as User | null,
	isAdmin: false,
	data: { users: [], drinks: [], orders: [] } as StoreData,
	signInWithLink: {} as (email: string | null) => Promise<{
		success: boolean;
		message: string;
	}>,
	sendSignInLink: {} as (email: string) => Promise<{
		message: string;
		success: boolean;
	}>,
	logout: {} as () => Promise<void>,
};
export const AuthContext = React.createContext(initialState);

export const useAuth = () => {
	return useContext(AuthContext);
};

export const actionCodeSettings = {
	// url: "http://localhost:3000/verify_signin",
	url: "https://admin-barmanagerx.web.app/verify_signin",
	handleCodeInApp: true,
};

interface Props {}

const convertUser = (user: MyUser, uid: string) => {
	return {
		...user,
		relationships: {
			orders: user.relationships
				? Object.entries(user.relationships?.orders).map((data) => {
						const [key, order] = data;
						return {
							...order,
							orderId: key,
						};
				  })
				: [],
		},
		uid,
	};
};
export const AuthProvider: FC<Props> = (props) => {
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [isAdmin, setisAdmin] = useState(initialState.isAdmin);
	const [data, setData] = useState<StoreData>(initialState.data);

	const signInWithLink = async (email: string | null) => {
		if (isSignInWithEmailLink(auth, window.location.href)) {
			if (!email) return { success: false, message: "🚨 メールが有効でない" };
			try {
				const roles = (await (await get(child(dbRef, `roles`))).val()) as Roles;
				const userVal = Object.values(roles).find((rol) => rol.email == email);
				if (userVal) {
					const {
						user: { uid },
					} = await signInWithEmailLink(auth, email, window.location.href);
					window.localStorage.removeItem("emailForSignIn");

					try {
						const adminSnap = await get(child(dbRef, `admins/${uid}`));
						const date = new Date().toISOString();

						if (!adminSnap.exists()) {
							await set(ref(db, `admins/${uid}`), {
								createdAt: date,
								updatedAt: date,
								uid: uid,
							});
						}
						window.close();
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
		// const userSnap = await get(child(dbRef, `roles/${email}`));
		const roles = (await get(child(dbRef, `roles`))).val() as Roles;
		console.log("roles", roles);

		const userVal = Object.values(roles).find((rol) => rol.email == email);
		if (userVal) {
			try {
				await sendSignInLinkToEmail(auth, email, {
					// url: `http://localhost:3000/verify_signin?email=${email}`,
					url: `https://admin-barmanagerx.web.app/verify_signin?email=${email}`,
					handleCodeInApp: true,
				});
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
		window.onbeforeunload = function () {
			return false;
		};

		const unsubscribe = auth.onAuthStateChanged((user) => {
			console.log("changed user");

			setCurrentUser(user);
			setLoading(false);
		});
		return unsubscribe;
	}, []);

	const initializeData = useCallback(async () => {
		if (currentUser) {
			const now = new Date().toISOString();
			const snap = await get(dbRef);
			const data_ = snap.val() as AllData;
			const admin = Object.values(data_.roles).find(
				(role) => role.email == currentUser.email
			);
			setisAdmin(admin != undefined ? admin.isAdmin : false);
			setData({
				users: Object.entries(data_.users).map((data) => {
					const [key, user] = data;
					return convertUser(user, key);
				}),
				drinks: Object.entries(data_.bottles).map((data) => {
					const [key, drink] = data;
					return {
						...drink,
						uid: key,
					};
				}),
				orders: Object.entries(data_.orders).map((data) => {
					const [key, order] = data;
					return {
						...order,
						uid: key,
					};
				}),
			});
			// setisAdmin(true);

			const usersRef = ref(db, "users");

			const drinkRef = ref(db, "bottles");
			const ordersRef = ref(db, "orders");
			////////////// Users  //////////////
			// return;

			onChildAdded(
				query(usersRef, orderByChild("createdAt"), startAt(now)),

				(newUser) => {
					console.log("added user", newUser.val().updatedAt);

					setData((oldData) => {
						return {
							...oldData,
							users: [
								convertUser(newUser.val(), newUser.key!),
								...oldData.users,
							],
						};
					});
				}
			);

			onChildChanged(usersRef, (changedUser) => {
				console.log("updated user", changedUser);

				setData((oldData) => {
					let newData = { ...oldData };
					const i = oldData.users.findIndex(
						(user) => user.uid == changedUser.key
					);
					newData.users[i] = convertUser(changedUser.val(), changedUser.key!);
					return newData;
				});
			});

			onChildRemoved(usersRef, (data) => {
				console.log("deleted user", data);

				setData((oldData) => {
					return {
						...oldData,
						users: oldData.users.filter((user) => user.uid != data.key),
					};
				});
			});

			////////////// Drinks  //////////////
			onChildAdded(
				query(drinkRef, orderByChild("createdAt"), startAt(now)),
				(newDrink) => {
					console.log("drinks added");

					setData((oldData) => {
						return {
							...oldData,
							drinks: [
								{ ...(newDrink.val() as MyBottle), uid: newDrink.key! },
								...oldData.drinks,
							],
						};
					});
				}
			);

			onChildChanged(drinkRef, (changedDrink) => {
				console.log("updated drink", changedDrink);
				setData((oldData) => {
					let newData = { ...oldData };
					const i = oldData.drinks.findIndex(
						(drink) => drink.uid == changedDrink.key
					);
					newData.drinks[i] = { ...changedDrink.val(), uid: changedDrink.key };

					return newData;
				});
			});

			onChildRemoved(drinkRef, (data) => {
				console.log("deleted", data);

				setData((oldData) => {
					return {
						...oldData,
						drinks: oldData.drinks.filter((drink) => drink.uid != data.key),
					};
				});
			});

			////////////// Orders  //////////////
			onChildAdded(
				query(ordersRef, orderByChild("createdAt"), startAt(now)),
				(newOrder) => {
					console.log("order added");

					setData((oldData) => {
						return {
							...oldData,
							orders: [
								{ ...(newOrder.val() as MyOrder), uid: newOrder.key! },
								...oldData.orders,
							],
						};
					});
				}
			);

			onChildChanged(ordersRef, (changedOrder) => {
				console.log("updated order", changedOrder);

				setData((oldData) => {
					let newData = { ...oldData };
					const i = oldData.orders.findIndex(
						(order) => order.uid == changedOrder.key
					);
					newData.orders[i] = { ...changedOrder.val(), uid: changedOrder.key };
					return newData;
				});
			});

			onChildRemoved(ordersRef, (data) => {
				console.log("deleted order", data);

				setData((oldData) => {
					return {
						...oldData,
						orders: oldData.orders.filter((order) => order.uid != data.key),
					};
				});
			});
		}
	}, [currentUser]);

	useEffect(() => {
		initializeData();
	}, [currentUser]);
	const context = {
		currentUser,
		data,
		isAdmin,
		signInWithLink,
		sendSignInLink,
		logout,
	};
	return (
		<AuthContext.Provider value={context}>
			{!loading && props.children}
		</AuthContext.Provider>
	);
};
