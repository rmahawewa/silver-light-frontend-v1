import React, { useState } from "react";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../utils/authSlice";

const Login = () => {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [userName, setUserName] = useState("");
	const [emailId, setEmailId] = useState("garry@yahoo.com");
	const [password, setPassword] = useState("Garry@123");
	const [isLoggingForm, setIsLoggingForm] = useState(true);
	const [error, setError] = useState("");
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleLogin = async () => {
		try {
			setError("");
			const res = await axios.post(
				BASE_URL + "/login",
				{
					email: emailId,
					password: password,
				},
				{ withCredentials: true }
			);

			// Dispatch the login action with the user data as the payload
			dispatch(login(res.data.data));

			// Navigate to the home page
			navigate("/");
		} catch (err) {
			setError(err?.response?.data);
			console.log(err.response.data);
		}
	};

	const handleSignup = async () => {
		try {
			setError("");
			const res = await axios.post(
				BASE_URL + "/signup",
				{
					firstName: firstName,
					lastName: lastName,
					userName: userName,
					email: emailId,
					password: password,
				},
				{ withCredentials: true }
			);
			if (res) {
				setIsLoggingForm((value) => !value);
			}
		} catch (err) {
			setError(err?.response?.data);
		}
	};

	return (
		<div className="flex justify-center py-12 ">
			<fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
				<legend className="fieldset-legend">
					{isLoggingForm ? "Login" : "Sign up"}
				</legend>
				{!isLoggingForm && (
					<>
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
					</>
				)}
				<label className="label">Email</label>
				<input
					type="email"
					className="input"
					placeholder="Email"
					value={emailId}
					onChange={(e) => setEmailId(e.target.value)}
				/>

				<label className="label">Password</label>
				<input
					type="password"
					className="input"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>

				<p className="text-red-500">{error}</p>

				<button
					onClick={isLoggingForm ? handleLogin : handleSignup}
					className="btn btn-neutral mt-4"
				>
					{isLoggingForm ? "Login" : "Sign up"}
				</button>
				<div
					className="justify-center"
					onClick={() => {
						setIsLoggingForm((value) => !value);
						setEmailId("");
						setPassword("");
					}}
				>
					<p className="text-center cursor-pointer">
						{isLoggingForm ? "I want to Sign up" : "Go to login"}
					</p>
				</div>
			</fieldset>
		</div>
	);
};

export default Login;
