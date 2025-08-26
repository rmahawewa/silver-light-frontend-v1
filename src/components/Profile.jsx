import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../utils/userSlice";
import { format } from "date-fns";

const Profile = () => {
	const [isEditable, setIsEditable] = useState(true);
	const user = useSelector((store) => store.user);
	//user input fields
	const [firstName, setFirstName] = useState(
		user.firstName ? user.firstName : ""
	);
	const [lastName, setLastName] = useState(user.lastName ? user.lastName : "");
	const [userName, setUserName] = useState(user.userName ? user.userName : "");
	const [birthday, setBirthday] = useState(
		user.birthday ? format(user.birthday, "MM/dd/yyyy") : ""
	);
	const [email, setEmail] = useState(user.email ? user.email : "");
	const [gender, setGender] = useState(user.gender ? user.gender : "");
	const [photoUrl, setPhotoUrl] = useState(user.photoUrl ? user.photoUrl : "");
	const [country, setCountry] = useState(user.country ? user.country : "");
	const [reagion, setReagion] = useState(user.reagion ? user.reagion : "");
	const [about, setAbout] = useState(user.about ? user.about : "");

	const [selectedFile, setSelectedFile] = useState({});
	const [previewUrl, setPreviewUrl] = useState(null);
	const [error, setError] = useState("");

	const dispatch = useDispatch();

	// Use a useEffect hook to log the state *after* it has been updated.
	// This hook runs whenever `photoUrl` or `selectedFile` changes.
	useEffect(() => {
		if (selectedFile) {
			console.log("Selected file has been updated:", selectedFile);
		}
		if (photoUrl) {
			console.log("Photo URL has been updated:", photoUrl);
		}
	}, [photoUrl, selectedFile]); // Dependency array: the effect runs when these values change.

	useEffect(() => {
		setFirstName(user.firstName ? user.firstName : "");
		setLastName(user.lastName ? user.lastName : "");
		setUserName(user.userName ? user.userName : "");
		setBirthday(user.birthday ? user.birthday : "");
		setEmail(user.email ? user.email : "");
		setGender(user.gender ? user.gender : "");
		setPhotoUrl(user.photoUrl ? user.photoUrl : "");
		setCountry(user.country ? user.country : "");
		setReagion(user.reagion ? user.reagion : "");
		setAbout(user.about ? user.about : "");
		console.log(photoUrl);
	}, [user]);

	const handleFileChange = (event) => {
		// setPhotoUrl(event.target.files[0]);

		let file = event.target.files[0];
		console.log(file); // logs the file details

		if (file) {
			// Basic validation: Check if it's an image
			if (!file.type.startsWith("image/")) {
				setError("Please select an image file (e.g., .jpg, .png, .gif).");
				setSelectedFile(null);
				setPhotoUrl(null);
				return;
			}

			setError(""); // Clear any previous errors
			setSelectedFile(event.target.files[0]);

			console.log(selectedFile); // retuns null

			// Create a FileReader instance
			const reader = new FileReader();

			// Set up the onload event handler
			reader.onloadend = () => {
				setPhotoUrl(reader.result); // reader.result contains the Data URL
				console.log(photoUrl);
			};

			// Read the file as a Data URL
			reader.readAsDataURL(file);
		} else {
			setSelectedFile(null);
			setPhotoUrl(null);
			setError("");
		}
	};

	const saveDetails = async () => {
		try {
			if (!selectedFile) {
				setMessage("Please select upload an image");
				return;
			}

			// console.log(selectedFile);

			const formData = new FormData();
			Object.keys(selectedFile).length > 0 &&
				formData.append("image", selectedFile);
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
			console.log(res.data.data);
			if (res.data.data) {
				//dispatch the user store
				dispatch(addUser(res.data.data));
				//view message

				setIsEditable(false);
			}
		} catch (err) {
			console.error(err);
			setError(err);
		}
	};

	return (
		<div className="flex justify-center">
			<fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
				<legend className="fieldset-legend">
					{isEditable ? "Edit Page details" : "Page details"}
				</legend>

				{isEditable ? (
					<div className="flex">
						<div>
							<label className="label">First name</label>
							<input
								type="text"
								className="input"
								placeholder="First name"
								value={firstName}
								onChange={(e) => setFirstName(e.target.value)}
							/>

							<label className="label">Last name</label>
							<input
								type="text"
								className="input"
								placeholder="Last name"
								value={lastName}
								onChange={(e) => setLastName(e.target.value)}
							/>

							<label className="label">User name</label>
							<input
								type="text"
								className="input"
								placeholder="User name"
								value={userName}
								onChange={(e) => setUserName(e.target.value)}
							/>

							<div className="w-30 h-30 my-5 flex items-center justify-center">
								{previewUrl ? (
									<img
										src={previewUrl}
										style={{
											maxWidth: "100%",
											maxHeight: "100%",
											objectFit: "contain",
										}}
									/>
								) : (
									photoUrl && (
										<img
											src={photoUrl}
											style={{
												maxWidth: "100%",
												maxHeight: "100%",
												objectFit: "contain",
											}}
										/>
									)
								)}
							</div>

							<div className="collapse">
								<input type="checkbox" />
								<div className="collapse-title">
									<label className="label">Photo url</label>
								</div>
								<div className="collapse-content text-sm">
									<input
										type="file"
										accept="image/*"
										className="input"
										placeholder="Photo url"
										onChange={(e) => handleFileChange(e)}
									/>
									{error && <p style={{ color: "red" }}>{error}</p>}
								</div>
							</div>

							<label className="label">Birthday</label>
							<input
								type="date"
								className="input"
								placeholder="Birthday"
								value={birthday}
								onChange={(e) => setBirthday(e.target.value)}
							/>

							<label className="label">Email</label>
							<input
								type="text"
								className="input"
								placeholder="Email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>

							<label className="label">Gender</label>
							<input
								type="text"
								className="input"
								placeholder="Gender"
								value={gender}
								onChange={(e) => setGender(e.target.value)}
							/>

							<label className="label">Country</label>
							<input
								type="text"
								className="input"
								placeholder="Country"
								value={country}
								onChange={(e) => setCountry(e.target.value)}
							/>

							<label className="label">Reagion</label>
							<input
								type="text"
								className="input"
								placeholder="Reagion"
								value={reagion}
								onChange={(e) => setReagion(e.target.value)}
							/>

							<label className="label">About</label>
							<input
								type="text"
								className="input"
								placeholder="About"
								value={about}
								onChange={(e) => setAbout(e.target.value)}
							/>

							<button
								className="btn btn-neutral mt-4"
								onClick={() => saveDetails()}
							>
								Save
							</button>
						</div>
					</div>
				) : (
					// <h1></h1>
					<>
						<label className="label">First name</label>
						<label>{firstName}</label>

						<label className="label">Last name</label>
						<label>{lastName}</label>

						<label className="label">User name</label>
						<label>{userName}</label>

						<label className="label">Birthday</label>
						<label>{birthday}</label>

						<label className="label">Email</label>
						<label>{email}</label>

						<label className="label">Gender</label>
						<label>{gender}</label>

						<label className="label">Photo url</label>
						<label>{photoUrl}</label>

						<label className="label">Country</label>
						<label>{country}</label>

						<label className="label">Reagion</label>
						<label>{reagion}</label>

						<label className="label">About</label>
						<label>{about}</label>

						<button
							className="btn btn-neutral mt-4"
							onClick={() => setIsEditable(true)}
						>
							Edit
						</button>
					</>
				)}
			</fieldset>
		</div>
	);
};

export default Profile;
