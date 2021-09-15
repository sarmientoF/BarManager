import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { doc, FieldValue, onSnapshot } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { database, db } from "../../firebase";

interface Attributes {
	name: string;
	phone: string;
	birthday: string;
	furigana: string;
	memo: string;
	photo: string;
	introducer: string;
	job: string;
	isInStore: boolean;
}

export interface Order {
	drinkCode: string;
	drinkId: string;
	orderId: string;

}

interface Relationships {
	orders?: Order[];
}
interface DrinkAttributes {
	name: string;
	memo?: string;
	url: string;
}
interface OrderAttributes {
	drinkId: string;
	drinkCode: string;
	userId: string;
	inUse?: boolean
}
export interface UserState {
	uid: string;
	attributes: Attributes;
	relationships?: Relationships;
	createdAt: string;
	updatedAt: string;
}

export interface DrinkState {
	attributes: DrinkAttributes;
	createdAt: string;
	updatedAt: string;
	uid: string;
}

export interface OrderState {
	uid: string;
	attributes: OrderAttributes;
	createdAt: string;
	updatedAt: string;
}
interface AdminState {
	user: UserState;
	customers: UserState[];
	drinks: DrinkState[];
	orders: OrderState[];
}

const UserAttributes: Attributes = {
	name: "",
	phone: "",
	job: "",
	birthday: "",
	furigana: "",
	introducer: "",
	memo: "",
	photo: "",
	isInStore: false,
};

const initialState: AdminState = {
	user: { uid: "", attributes: UserAttributes, createdAt: "", updatedAt: "" },
	customers: [],
	drinks: [],
	orders: [],
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

			state.customers = data;
		},
		watchDrinks(state, action: PayloadAction<any>) {
			let data = action.payload;
			state.drinks = data;
		},
		watchOrders(state, action: PayloadAction<any>) {
			let data = action.payload;
			state.orders = data;
		},
	},
});

export const { watchUser, watchUsers, watchDrinks, watchOrders } =
	userSlice.actions;
export default userSlice.reducer;
