import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { SocketProvider } from "../context/SocketContext"; // Import the provider

const Body = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const userData = useSelector((store) => store.user);

	const fetchUser = async () => {
		try {
			const res = await axios.get(BASE_URL + "/profile/view", {
				withCredentials: true,
			});
			// console.log(res.data);
			dispatch(addUser(res.data));
		} catch (err) {
			if (err.status == 401) {
				navigate("/login");
			}
			console.error(err.message);
		}
	};

	useEffect(() => {
		if (!userData) {
			fetchUser();
		}
	}, [userData, dispatch, navigate]);

	return (
		<SocketProvider>
			<div>
				<NavBar />
				<Outlet />
			</div>
		</SocketProvider>
	);
};

export default Body;
