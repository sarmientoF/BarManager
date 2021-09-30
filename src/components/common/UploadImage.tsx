import React, { useState } from "react";
import { storage } from "../../firebase";
import { FilePond } from "react-filepond";
import { v4 as uuidv4 } from "uuid";
import { getDownloadURL } from "firebase/storage";
import { ref, uploadBytesResumable } from "@firebase/storage";

interface Props {
	setUrl: (state: string) => void;
	uid: string;
	refPath: string;
}

const UploadImage = ({ setUrl, uid, refPath }: Props) => {
	const [files, setFiles] = useState<any>([]);

	return (
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
				process: (fieldName, file, metadata, load, error, progress, abort) => {
					const imageRef = ref(storage, refPath);

					const uploadTask = uploadBytesResumable(
						ref(imageRef, uid),
						file,
						metadata
					);

					uploadTask.on(
						"state_changed",
						(snapshot) => {
							progress(true, snapshot.bytesTransferred, snapshot.totalBytes);
						},
						(err) => {
							error(err.message);
						},
						() => {
							getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
								load(uid);
								setUrl(downloadURL);
							});
						}
					);
				},
				revert: (uniqueFieldId, load, error) => {
					setUrl("");
					load();
				},
			}}
			acceptedFileTypes={["image/*"]}
			name="files"
			labelIdle='Drag or Drop your files or <span class="filepond--label-action">Browse</span>'
		/>
	);
};

export default UploadImage;
