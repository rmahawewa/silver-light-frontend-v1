import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../utils/userSlice";

const ChangePassword = () => {
	const user = useSelector((store) => store.user);
	console.log(user);

	const dispatch = useDispatch();

	const [oldPassword, setOldPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");

	const savePassword = async () => {
		try {
			if (oldPassword === newPassword) {
				throw new Error("Old password and New password can not be same");
				return;
			}
			const res = await axios.patch(
				BASE_URL + "/change-password",
				{ oldpassword: oldPassword, newpassword: newPassword },
				{ withCredentials: true }
			);
			console.log(res.data.data);
			dispatch(addUser(res.data.data));
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<div>
			<div className="flex justify-center">
				<fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
					<legend className="fieldset-legend">Change Password</legend>
					<div>
						<label className="label">Old Password</label>
						<input
							type="text"
							className="input"
							placeholder="Old Password"
							value={oldPassword}
							onChange={(e) => setOldPassword(e.target.value)}
						/>

						<label className="label">New Password</label>
						<input
							type="text"
							className="input"
							placeholder="New Password"
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
						/>
						<button
							className="btn btn-neutral mt-4"
							onClick={() => savePassword()}
						>
							Save
						</button>
					</div>
				</fieldset>
			</div>
		</div>
	);
};

export default ChangePassword;
