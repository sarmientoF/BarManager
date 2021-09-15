import {
	FieldValue,
	FirestoreDataConverter,
	Timestamp,
} from "@firebase/firestore";

interface OrderProps {
	attributes: OrdersAttributes;
	createdAt: FieldValue;
	updatedAt: FieldValue;
	uid: string;
}
interface OrdersAttributes {
	drinkCode?: string;
	drinkId?: string;
	userId?: string;
	inUse?: boolean
}

export class OrderData {
	attributes: OrdersAttributes;
	createdAt: string;
	updatedAt: string;
	uid: string;
	constructor(
		attributes: OrdersAttributes,
		createdAt: Timestamp,
		updatedAt: Timestamp,
		uid: string
	) {
		this.attributes = attributes;
		this.createdAt = createdAt?.toDate().toISOString() || "";
		this.updatedAt = updatedAt?.toDate().toISOString() || "";
		this.uid = uid;
	}
}

export var orderConverter: FirestoreDataConverter<OrderData> = {
	toFirestore: (user: OrderProps) => {
		return {
			attributes: user.attributes,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
			uid: user.uid,
		};
	},
	fromFirestore: (snapshot: any, options: any) => {
		const data = snapshot.data(options);

		const drink = new OrderData(
			data.attributes,
			data.createdAt,
			data.updatedAt,
			data.uid
		);
		return {
			...drink,
		};
	},
};
