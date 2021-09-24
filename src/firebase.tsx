import {
	browserLocalPersistence,
	getAuth,
	setPersistence,
	signInWithEmailLink,
	User,
} from "firebase/auth";
import { getFirestore, collection, serverTimestamp } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
	apiKey: "AIzaSyBrm7hgHYXn1KKolxpH8BAHAhZD3FZ19EI",
	authDomain: "barmanagerx.firebaseapp.com",
	databaseURL:
		"https://barmanagerx-default-rtdb.asia-southeast1.firebasedatabase.app",
	projectId: "barmanagerx",
	storageBucket: "barmanagerx.appspot.com",
	messagingSenderId: "35056030221",
	appId: "1:35056030221:web:68ec6896a76a56afa53b44",
	measurementId: "G-1W2MTXZ2L3",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore();

export const database = {
	users: collection(db, "users"),
	drinks: collection(db, "drinks"),
	orders: collection(db, "orders"),
	folders: collection(db, "folders"),
	admins: collection(db, "admins"),
	employees: collection(db, "employees"),
	managers: collection(db, "managers"),
	files: collection(db, "files"),
	formatDoc: (doc: any) => {
		return { id: doc.id, ...doc.data() };
	},
	getCurrentTimestamp: serverTimestamp,
};

export const storage = getStorage(app);
export const auth = getAuth();

export default app;
