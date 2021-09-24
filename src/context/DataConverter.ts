import {
	FieldValue,
	FirestoreDataConverter,
	Timestamp,
} from "@firebase/firestore";

// From Firestore
interface UserProps {
	attributes: UserAttributes;
	relationships: any;
	createdAt: FieldValue;
	updatedAt: FieldValue;
	uid: string;
}

interface UserAttributes {
	name?: string;
	job?: string;
	phone?: string;
	birthday?: string;
	furigana?: string;
	memo?: string;
	photo?: string;
	introducer?: string;
	isInStore?: boolean;
	isAdmin?: boolean
}

interface Order {
	drinkId: string;
	drinkCode: string;
	orderId: string;
}

interface Orders {
	[key: string]: Order;
}
interface UserRelationships {
	orders: Orders;
}
// From JS
export class UserData {
	attributes: UserAttributes;
	relationships: { orders: Order[] };
	createdAt: string;
	updatedAt: string;
	uid: string;
	constructor(
		attributes: UserAttributes,
		relationships: UserRelationships,
		createdAt: Timestamp,
		updatedAt: Timestamp,
		uid: string
	) {
		this.attributes = attributes;
		this.createdAt = createdAt.toDate().toISOString();
		this.updatedAt = updatedAt?.toDate().toISOString() || "";
		this.uid = uid;
		let orders = relationships?.orders || {};

		this.relationships = {
			orders: Object.keys(orders).map((key) => {
				return { ...orders[key], orderId: key };
			}),
		};
	}
}

// Firestore data converter
export var userConverter: FirestoreDataConverter<UserData> = {
	toFirestore: (user: UserProps) => {
		return {
			attributes: user.attributes,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
			uid: user.uid,
		};
	},
	fromFirestore: (snapshot: any, options: any) => {
		const data = snapshot.data(options);

		const user = new UserData(
			data.attributes,
			data.relationships,
			data.createdAt,
			data.updatedAt,
			data.uid
		);
		return {
			...user,
		};
	},
};
