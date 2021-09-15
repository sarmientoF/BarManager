import { updateDoc } from "@firebase/firestore";
import { doc } from "firebase/firestore";
import React, { useRef, useState } from "react";
import { UserState } from "../../features/user/user-slice";
import { database } from "../../firebase";
import UploadImage from "../common/UploadImage";
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import "react-datepicker/dist/react-datepicker.css";
// import "react-datepicker/dist/react-datepicker-cssmodules.css";

registerLocale("ja", ja);
interface Props {
	user: UserState;
	open: boolean;
	setOpen: (state: boolean) => void;
}

const TransformDate = (date: string) => {
	const values = date.split("-");
	console.log(`🚨${values[0]}年${values[1]}月${values[2]}日`);

	return `${values[0]}年${values[1]}月${values[2]}日`;
};

const UpdateModal = ({ user, open, setOpen }: Props) => {
	const uid = user.uid;

	const [url, setUrl] = useState("");
	const [birthday, setBirthday] = useState(
		user.attributes.birthday
			? new Date(user.attributes.birthday)
			: new Date("1970-01-01")
	);
	const nameRef = useRef<HTMLInputElement>(null);
	const furiganaRef = useRef<HTMLInputElement>(null);
	const birthdayRef = useRef<HTMLInputElement>(null);
	const phoneRef = useRef<HTMLInputElement>(null);
	const memoRef = useRef<HTMLInputElement>(null);
	const introducerRef = useRef<HTMLInputElement>(null);
	const jobRef = useRef<HTMLInputElement>(null);
	const [loading, setLoading] = useState(false);

	const handleUpdate = async () => {
		const name = nameRef.current?.value || "";
		const furigana = furiganaRef.current?.value || "";
		const _birthday = birthday.toISOString().slice(0, 10);
		const phone = phoneRef.current?.value || "";
		const memo = memoRef.current?.value || "";
		const introducer = introducerRef.current?.value || "";
		const job = jobRef.current?.value || "";

		const newUrl = url || user.attributes.photo || "";

		console.log("new url", newUrl);

		setLoading(true);
		await updateDoc(doc(database.users, uid), {
			updatedAt: database.getCurrentTimestamp(),
			"attributes.name": name,
			"attributes.furigana": furigana,
			"attributes.birthday": _birthday,
			"attributes.phone": phone,
			"attributes.memo": memo,
			"attributes.introducer": introducer,
			"attributes.job": job,
			"attributes.photo": newUrl,
		});
		setLoading(false);
		setOpen(false);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const tabs = ["タブ 1", "タブ 2", "タブ 3"];

	const [index, setIndex] = useState(0);
	return (
		<div className={`modal ${"modal-open"} transition-all`}>
			<span
				className="absolute w-full h-full"
				onClick={() => {
					setOpen(false);
				}}
			></span>

			<div className="modal-box">
				<div className="card-body py-0">
					<div className="tabs">
						{tabs.map((tab, i) => (
							<a
								onClick={() => {
									setIndex(i);
								}}
								className={`tab tab-lifted ${i == index && "tab-active"}`}
								key={i}
							>
								{tab}
							</a>
						))}
					</div>
					<div className={`${index != 0 && "sr-only"}`}>
						<div className="form-control">
							<label className="label">
								<span className="label-text">名前</span>
							</label>
							<input
								type="text"
								placeholder="名前"
								className="input input-bordered"
								defaultValue={user.attributes.name}
								ref={nameRef}
							/>
						</div>
						<div className="form-control">
							<label className="label">
								<span className="label-text">名前（フリガナ）</span>
							</label>
							<input
								type="text"
								placeholder="フリガナ"
								className="input input-bordered"
								defaultValue={user.attributes.furigana}
								ref={furiganaRef}
							/>
						</div>
						<div className="form-control">
							<label className="label">
								<span className="label-text">誕生日</span>
							</label>
							<DatePicker
								className="input input-bordered w-full"
								// className="text-center date-picker-reports"
								dateFormat="yyyy年MM月dd日"
								locale="ja"
								selected={birthday}
								maxDate={new Date()}
								onChange={(date) => {
									setBirthday(date as Date);
								}}
								peekNextMonth
								showMonthDropdown
								showYearDropdown
								dropdownMode="select"
							/>
						</div>
						<div className="form-control">
							<label className="label">
								<span className="label-text">電話番号</span>
							</label>
							<input
								type="text"
								placeholder="電話番号"
								className="input input-bordered"
								defaultValue={user.attributes.phone}
								ref={phoneRef}
							/>
						</div>
					</div>
					<div className={`${index != 1 && "sr-only"}`}>
						<div className="form-control">
							<label className="label">
								<span className="label-text">メモ</span>
							</label>
							<input
								type="text"
								placeholder="メモ"
								className="input input-bordered"
								defaultValue={user.attributes.memo}
								ref={memoRef}
							/>
						</div>
						<div className="form-control">
							<label className="label">
								<span className="label-text">紹介者</span>
							</label>
							<input
								type="text"
								placeholder="紹介者"
								className="input input-bordered"
								defaultValue={user.attributes.introducer}
								ref={introducerRef}
							/>
						</div>
						<div className="form-control">
							<label className="label">
								<span className="label-text">会社名</span>
							</label>
							<input
								type="text"
								placeholder="会社名"
								className="input input-bordered"
								defaultValue={user.attributes.job}
								ref={jobRef}
							/>
						</div>
					</div>
					<div className={`${index != 2 && "sr-only"}`}>
						<div className="form-control">
							<label className="label">
								<span className="label-text">画像</span>
							</label>
							<UploadImage setUrl={setUrl} refPath={`users/${uid}`} />
						</div>
					</div>

					<div className="form-control mt-6 flex-row justify-around space-x-1">
						<input
							type="button"
							value="更新する"
							className="btn btn-info text-white w-1/2"
							onClick={handleUpdate}
							disabled={loading}
						/>
						<input
							type="button"
							value="キャンセル"
							className="btn btn-error text-white w-1/2"
							onClick={handleClose}
							disabled={loading}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default UpdateModal;
