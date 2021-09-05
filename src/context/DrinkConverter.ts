import {
	FieldValue,
	FirestoreDataConverter,
	Timestamp,
} from "@firebase/firestore";

interface DrinkProps {
	attributes: DrinksAttributes;
	createdAt: FieldValue;
	updatedAt: FieldValue;
	uid: string;
}
interface DrinksAttributes {
	name?: string;
	url?: string;
	memo?: string;
}

export class DrinkData {
	attributes: DrinksAttributes;
	createdAt: string;
	updatedAt: string;
	uid: string;
	constructor(
		attributes: DrinksAttributes,
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

export var drinkConverter: FirestoreDataConverter<DrinkData> = {
	toFirestore: (user: DrinkProps) => {
		return {
			attributes: user.attributes,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
			uid: user.uid,
		};
	},
	fromFirestore: (snapshot: any, options: any) => {
		const data = snapshot.data(options);

		const drink = new DrinkData(
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
