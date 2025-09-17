import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import { useSocket } from "../context/SocketContext";
import { useSelector } from "react-redux";

const MainContent = () => {
	const userData = useSelector((store) => store.user);
	const socket = useSocket();

	useEffect(() => {
		if (userData && socket) {
			socket.emit("joinNotifications", {
				userId: userData._id,
			});
		}
	}, [userData, socket]);

	return (
		<div>
			<NavBar />
			<Outlet />
		</div>
	);
};

export default MainContent;
