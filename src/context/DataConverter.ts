import {
	FieldValue,
	FirestoreDataConverter,
	Timestamp,
} from "@firebase/firestore";

// From Firestore
interface UserProps {
	attributes: UserAttributes;
	createdAt: FieldValue;
	updatedAt: FieldValue;
	uid: string;
}

interface UserAttributes {
	name?: string;
	job?: string;
	phone?: string;
	isInStore: boolean;
}

// From JS
export class UserData {
	attributes: UserAttributes;
	createdAt: string;
	updatedAt: string;
	uid: string;
	constructor(
		attributes: UserAttributes,
		createdAt: Timestamp,
		updatedAt: Timestamp,
		uid: string
	) {
		this.attributes = attributes;
		this.createdAt = createdAt.toDate().toISOString();
		this.updatedAt = updatedAt?.toDate().toISOString() || "";
		this.uid = uid;
	}
}

// Firestore data converter
export var userConverter: FirestoreDataConverter<UserData> = {
	toFirestore: (user: UserProps) => {
		console.log("🚨🚨 To Firestore");

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
			data.createdAt,
			data.updatedAt,
			data.uid
		);
		return {
			...user,
		};
	},
};
