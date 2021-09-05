import { updateDoc } from "@firebase/firestore";
import { collection, doc, setDoc } from "firebase/firestore";
import React, { useRef, useState } from "react";
import { UserState } from "../../features/user/user-slice";
import { database, db, storage } from "../../firebase";
import { FilePond } from "react-filepond";
import { v4 as uuidv4 } from "uuid";
import { getDownloadURL } from "firebase/storage";
import { ref, uploadBytes, uploadBytesResumable } from "@firebase/storage";

interface Props {
	open: boolean;
	setOpen: (state: boolean) => void;
}

const DrinkModal = ({ open, setOpen }: Props) => {
	const [loading, setLoading] = useState(false);
	const [files, setFiles] = useState<any>([]);
	const [url, setUrl] = useState("");

	const drinkNameRef = useRef<HTMLInputElement>(null);

	const handleCreate = async () => {
		setLoading(true)
		const drinkName = drinkNameRef.current?.value;
		if (!url || !drinkName) return;
		const newDrinkRef = doc(collection(db, "drinks"));
		setLoading(true);
		await setDoc(newDrinkRef, {
			attributes: {
				name: drinkName,
				url: url,
			},
			createdAt: database.getCurrentTimestamp(),
			updatedAt: database.getCurrentTimestamp(),
			uid: newDrinkRef.id,
		});
		setOpen(false);

	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<div className={`modal ${open && "modal-open"} transition-all`}>
			<span
				className="absolute w-full h-full"
				onClick={() => {
					setOpen(false);
				}}
			></span>

			<div className="modal-box">
				<div className="card-body">
					<div className="form-control">
						<label className="label">
							<span className="label-text">Drink Name</span>
						</label>
						<input
							type="text"
							placeholder="name"
							className="input input-bordered"
							ref={drinkNameRef}
							required
						/>
					</div>
					<div className="form-control">
						<label className="label">
							<span className="label-text">Image</span>
						</label>
						<FilePond
							files={files}
							onupdatefiles={(fileItems) => {
								if (!fileItems) {
									return;
								}
								setFiles(fileItems.map((fileItem) => fileItem.file));
							}}
							allowMultiple={false}
							maxFiles={1}
							server={{
								process: (
									fieldName,
									file,
									metadata,
									load,
									error,
									progress,
									abort
								) => {
									// create a unique id for the file
									const drinksImageRef = ref(storage, "images");

									const id = uuidv4();
									console.log("Created id:", id);

									const uploadTask = uploadBytesResumable(
										ref(drinksImageRef, id),
										file,
										metadata
									);

									uploadTask.on(
										"state_changed",
										(snapshot) => {
											progress(
												true,
												snapshot.bytesTransferred,
												snapshot.totalBytes
											);
										},
										(err) => {
											error(err.message);
										},
										() => {
											// the file has been uploaded
											load(id);
											getDownloadURL(uploadTask.snapshot.ref).then(
												(downloadURL) => {
													console.log("File available at", downloadURL);
													setUrl(downloadURL);
												}
											);
										}
									);
								},
								revert: (uniqueFieldId, load, error) => {
									console.log("rever id:", uniqueFieldId);
									setUrl("");
									load();
									console.log("Finished 🚀");
								},
							}}
							acceptedFileTypes={["image/*"]}
							name="files"
							labelIdle='Drag Drop your files or <span class="filepond--label-action">ばか</span>'
						/>
					</div>
					<div className="form-control mt-4">
						<input
							type="submit"
							value="Add drink"
							className="btn btn-info text-white"
							disabled={loading || !url}
							onClick={handleCreate}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DrinkModal;
