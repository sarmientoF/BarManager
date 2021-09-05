import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { doc, FieldValue, onSnapshot } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { database, db } from "../../firebase";

interface Attributes {
	name: string;
	phone: string;
	job: string;
	isInStore: boolean;
}

interface DrinkAttributes {
	name: string;
	memo?: string;
	url: string;
}
export interface UserState {
	uid: string;
	attributes: Attributes;
	createdAt: string;
	updatedAt: string;
}

export interface DrinkState {
	uid: string;
	attributes: DrinkAttributes;
	createdAt: string;
	updatedAt: string;
}
interface AdminState {
	user: UserState;
	customers: UserState[];
	drinks: DrinkState[];
}

const UserAttributes: Attributes = {
	name: "",
	phone: "",
	job: "",
	isInStore: false,
};

const initialState: AdminState = {
	user: { uid: "", attributes: UserAttributes, createdAt: "", updatedAt: "" },
	customers: [],
	drinks: [],
};

const userSlice = createSlice({
	name: "admin",
	initialState,
	reducers: {
		watchUser(state, action: PayloadAction<UserState>) {
			let data = action.payload;
			state.user = { ...data, attributes: data.attributes || UserAttributes };
		},
		watchUsers(state, action: PayloadAction<any>) {
			let data = action.payload;
			// console.log("watch users:", data);

			state.customers = data;
		},
		watchDrinks(state, action: PayloadAction<any>) {
			let data = action.payload;
			state.drinks = data;
		},
	},
});

export const { watchUser, watchUsers, watchDrinks } = userSlice.actions;
export default userSlice.reducer;
