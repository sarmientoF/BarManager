import { getAuth } from "firebase/auth";
import { getDatabase, onDisconnect, ref } from "firebase/database";
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

export const db = getDatabase();
const presenceRef = ref(db, "disconnectmessage");
// Write a string when this client loses connection
onDisconnect(presenceRef).set("I disconnected!");
export const dbRef = ref(db);
export const storage = getStorage(app);
export const auth = getAuth();
export default app;
