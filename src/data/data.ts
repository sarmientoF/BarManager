export interface Roles {
  [key: string]: { isAdmin: boolean; email: string };
}
export interface AllData {
  users: { [key: string]: MyUser };
  orders: { [key: string]: MyOrder };
  bottles: { [key: string]: MyBottle };
  roles: { [key: string]: { isAdmin: boolean; email: string } };
}

export interface MyBottle {
  attributes: BottleAttributes;
  updatedAt: string;
  createdAt: string;
}
export interface Bottle {
  attributes: BottleAttributes;
  updatedAt: string;
  createdAt: string;
  uid: string;
}

export interface BottleAttributes {
  name: string;
  url: string;
  memo: string;
}

export interface MyOrder {
  attributes: OrderAttributes;
  updatedAt: string;
  createdAt: string;
}
export interface Order {
  attributes: OrderAttributes;
  updatedAt: string;
  createdAt: string;
  uid: string;
}

export interface OrderAttributes {
  drinkId: string;
  drinkCode: string;
  userId: string;
  inUse: boolean;
}

export interface MyUser {
  attributes: UserAttributes;
  relationships?: Relationships;
  updatedAt: string;
  createdAt: string;
}
export interface MyAdmin {
  updatedAt: string;
  createdAt: string;
  uid: string;
}

export interface UserAttributes {
  email: string;
  mig?: boolean;
  name: string;
  furigana: string;
  job: string;
  phone: string;
  memo: string;
  photo: string;
  introducer: string;
  isInStore: boolean;
  birthday: string;
  customerNumber: number;
}

export interface Relationships {
  orders: { [key: string]: RelationshipsOrder };
}

export interface RelationshipsOrder {
  drinkId: string;
  drinkCode: string;
  orderId: string;
}

export interface StoreData {
  users: User[];
  orders: Order[];
  drinks: Bottle[];
}
export interface User {
  attributes: UserAttributes;
  relationships: UserRelationships;
  updatedAt: string;
  createdAt: string;
  uid: string;
}
export interface UserRelationships {
  orders: RelationshipsOrder[];
}
