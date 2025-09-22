import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../utils/userSlice";
import { format } from "date-fns";

const Profile = () => {
	const [isEditable, setIsEditable] = useState(true);
	// const user = useSelector((store) => store.user);
	const user = useSelector((store) => store.auth.user);
	const dispatch = useDispatch();

	// State for all user input fields
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [userName, setUserName] = useState("");
	const [birthday, setBirthday] = useState("");
	const [email, setEmail] = useState("");
	const [gender, setGender] = useState("");
	const [photoUrl, setPhotoUrl] = useState("");
	const [country, setCountry] = useState("");
	const [reagion, setReagion] = useState("");
	const [about, setAbout] = useState("");

	// State for file upload and errors
	const [selectedFile, setSelectedFile] = useState(null);
	const [error, setError] = useState("");

	// This useEffect hook runs whenever the `user` state from Redux changes.
	// It populates the local component state with the user's details.
	useEffect(() => {
		if (user) {
			setFirstName(user.firstName || "");
			setLastName(user.lastName || "");
			setUserName(user.userName || "");
			// Correctly format the birthday string to "yyyy-MM-dd" for the input field.
			setBirthday(
				user.birthday ? format(new Date(user.birthday), "yyyy-MM-dd") : ""
			);
			setEmail(user.email || "");
			setGender(user.gender || "");
			setPhotoUrl(user.photoUrl || "");
			setCountry(user.country || "");
			setReagion(user.reagion || "");
			setAbout(user.about || "");
		}
	}, [user]);

	const handleFileChange = (event) => {
		const file = event.target.files[0];

		if (file) {
			if (!file.type.startsWith("image/")) {
				setError("Please select an image file (e.g., .jpg, .png, .gif).");
				setSelectedFile(null);
				return;
			}

			setError("");
			setSelectedFile(file);
			setPhotoUrl(URL.createObjectURL(file)); // Use a temporary object URL for preview
		} else {
			setSelectedFile(null);
			// Revert to original photoUrl if the user cancels file selection
			setPhotoUrl(user.photoUrl || "");
			setError("");
		}
	};

	const saveDetails = async () => {
		try {
			const formData = new FormData();

			// Append file if selected
			if (selectedFile) {
				formData.append("image", selectedFile);
			}

			formData.append("firstName", firstName);
			formData.append("lastName", lastName);
			formData.append("userName", userName);
			formData.append("birthday", birthday);
			formData.append("email", email);
			formData.append("gender", gender);
			formData.append("country", country);
			formData.append("reagion", reagion);
			formData.append("about", about);

			const res = await axios.patch(BASE_URL + "/update", formData, {
				headers: { "Content-Type": "multipart/form-data" },
				withCredentials: true,
			});

			if (res.data.data) {
				dispatch(addUser(res.data.data));
				setIsEditable(false);
			}
		} catch (err) {
			console.error(err);
			setError(err.message || "An error occurred.");
		}
	};

	return (
		<div className="flex justify-center p-4">
			<fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full max-w-2xl border p-6">
				<legend className="fieldset-legend text-2xl font-bold px-2">
					{isEditable ? "Edit Profile Details" : "Profile Details"}
				</legend>

				{isEditable ? (
					<div className="space-y-4">
						<div className="w-32 h-32 my-5 mx-auto rounded-full overflow-hidden border-2 border-gray-300 shadow-md">
							{photoUrl ? (
								<img
									src={photoUrl}
									alt="User Profile"
									className="w-full h-full object-cover"
								/>
							) : (
								<div className="w-full h-full bg-gray-400 flex items-center justify-center text-gray-700">
									No Image
								</div>
							)}
						</div>

						<div className="collapse bg-base-100 rounded-lg shadow-sm">
							<input type="checkbox" className="min-h-0" />
							<div className="collapse-title label font-semibold text-lg text-gray-700">
								<label>Change Photo</label>
							</div>
							<div className="collapse-content">
								<input
									type="file"
									accept="image/*"
									className="input file-input w-full"
									onChange={(e) => handleFileChange(e)}
								/>
								{error && <p className="text-red-500 text-sm mt-2">{error}</p>}
							</div>
						</div>

						<label className="label">First name</label>
						<input
							type="text"
							className="input w-full"
							placeholder="First name"
							value={firstName}
							onChange={(e) => setFirstName(e.target.value)}
						/>

						<label className="label">Last name</label>
						<input
							type="text"
							className="input w-full"
							placeholder="Last name"
							value={lastName}
							onChange={(e) => setLastName(e.target.value)}
						/>

						<label className="label">User name</label>
						<input
							type="text"
							className="input w-full"
							placeholder="User name"
							value={userName}
							onChange={(e) => setUserName(e.target.value)}
						/>

						<label className="label">Birthday</label>
						<input
							type="date"
							className="input w-full"
							placeholder="Birthday"
							value={birthday}
							onChange={(e) => setBirthday(e.target.value)}
						/>

						<label className="label">Email</label>
						<input
							type="email"
							className="input w-full"
							placeholder="Email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>

						<label className="label">Gender</label>
						<input
							type="text"
							className="input w-full"
							placeholder="Gender"
							value={gender}
							onChange={(e) => setGender(e.target.value)}
						/>

						<label className="label">Country</label>
						<input
							type="text"
							className="input w-full"
							placeholder="Country"
							value={country}
							onChange={(e) => setCountry(e.target.value)}
						/>

						<label className="label">Region</label>
						<input
							type="text"
							className="input w-full"
							placeholder="Region"
							value={reagion}
							onChange={(e) => setReagion(e.target.value)}
						/>

						<label className="label">About</label>
						<textarea
							className="textarea w-full"
							placeholder="About"
							value={about}
							onChange={(e) => setAbout(e.target.value)}
						></textarea>

						<button
							className="btn btn-neutral w-full mt-4"
							onClick={saveDetails}
						>
							Save
						</button>
					</div>
				) : (
					<div className="space-y-4">
						<div className="w-32 h-32 my-5 mx-auto rounded-full overflow-hidden border-2 border-gray-300 shadow-md">
							{photoUrl && (
								<img
									src={photoUrl}
									alt="User Profile"
									className="w-full h-full object-cover"
								/>
							)}
						</div>

						<label className="label font-semibold">First name</label>
						<p className="text-gray-700">{firstName}</p>

						<label className="label font-semibold">Last name</label>
						<p className="text-gray-700">{lastName}</p>

						<label className="label font-semibold">User name</label>
						<p className="text-gray-700">{userName}</p>

						<label className="label font-semibold">Birthday</label>
						<p className="text-gray-700">{birthday}</p>

						<label className="label font-semibold">Email</label>
						<p className="text-gray-700">{email}</p>

						<label className="label font-semibold">Gender</label>
						<p className="text-gray-700">{gender}</p>

						<label className="label font-semibold">Country</label>
						<p className="text-gray-700">{country}</p>

						<label className="label font-semibold">Region</label>
						<p className="text-gray-700">{reagion}</p>

						<label className="label font-semibold">About</label>
						<p className="text-gray-700">{about}</p>

						<button
							className="btn btn-neutral w-full mt-4"
							onClick={() => setIsEditable(true)}
						>
							Edit
						</button>
					</div>
				)}
			</fieldset>
		</div>
	);
};

export default Profile;
