import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
} from "firebase/auth";
import React, { useEffect, useRef, useState } from "react";
import PrivateContainer from "../components/common/PrivateContainer";
import { auth, database, db } from "../firebase";
import jsonData from "../json/users.json";
import jsonDrink from "../json/drinks.json";
import { doc, setDoc } from "@firebase/firestore";
import { collection } from "firebase/firestore";
const handleSaveToPC = (jsonData: any, name: string) => {
	const fileData = JSON.stringify(jsonData);
	const blob = new Blob([fileData], { type: "text/plain" });
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.download = `${name}.json`;
	link.href = url;
	link.click();
};

interface Props {}

const CreateUserPage = (props: Props) => {
	const emailRef = useRef<HTMLInputElement>(null);

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const handleAdd = async () => {
		setLoading(true);
		const email = emailRef.current?.value;
		if (!email) return;
		console.log(email);

		try {
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				"111111"
			);
			const user = userCredential.user;
			console.log("🚨 new user", user);
		} catch (error) {
			setError(`${error}`);
		}
	};

	const createDrinks = async () => {
		let data = JSON.parse(JSON.stringify(jsonDrink));

		for await (const key of Object.keys(data)) {
			let drink = data[key];
			const newDrinkRef = doc(database.drinks);
			await setDoc(newDrinkRef, {
				attributes: {
					name: drink.name,
					url: "",
				},
				createdAt: database.getCurrentTimestamp(),
				updatedAt: database.getCurrentTimestamp(),
				uid: newDrinkRef.id,
			});
			drink.uid = newDrinkRef.id;
		}

		handleSaveToPC(data, "drinks_");
	};

	const createNewUsers = async () => {
		let data = JSON.parse(JSON.stringify(jsonData));
		let count = 0;
		for await (const key of Object.keys(data)) {
			let user = data[key];
			const userCredential = await signInWithEmailAndPassword(
				auth,
				`test_${count}@gmail.com`,
				"111111"
			);
			user.uid = userCredential.user.uid;
			count += 1;
		}
		handleSaveToPC(data, "users");
	};
	useEffect(() => {
		// createDrinks();
		// createNewUsers();
		// handleSaveToPC(data);
	}, []);

	const [open, setOpen] = useState(false);
	return (
		<PrivateContainer>
			{error && (
				<div
					className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative"
					role="alert"
				>
					<strong className="font-bold">{error}</strong>

					<span
						className="absolute top-0 bottom-0 right-0 px-4 py-3"
						onClick={() => {
							setOpen(false);
						}}
					>
						<svg
							className="fill-current h-6 w-6 text-blue-700"
							role="button"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
						>
							<title>Close</title>
							<path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
						</svg>
					</span>
				</div>
			)}
			<div className="hero min-h-screen bg-base-200">
				<div className="text-center hero-content w-full">
					<div className="card flex-shrink-0 w-full max-w-lg bg-base-100  shadow-2xl filter drop-shadow-2xl ">
						<div className="card-body">
							<div className="form-control">
								<label className="label">
									<span className="label-text">メール</span>
								</label>
								<input
									type="email"
									placeholder="メール"
									className="input input-bordered required:input-info  focus:invalid:input-error valid:input-info invalid:input-error"
									required
									ref={emailRef}
									autoComplete="email"
								/>
							</div>
							<div className="form-control mt-6">
								<button
									type="submit"
									className="font-semibold text-lg btn btn-primary border-none bg-gradient-to-tr from-yellow-500 via-red-400 to-pink-500 disabled:opacity-70 "
									disabled={loading}
									// onClick={handleAdd}
								>
									追加する
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</PrivateContainer>
	);
};

export default CreateUserPage;
