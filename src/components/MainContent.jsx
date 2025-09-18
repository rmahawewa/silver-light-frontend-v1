import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import { useSocket } from "../context/SocketContext";
import { useSelector } from "react-redux";

const MainContent = () => {
	const userData = useSelector((store) => store.user);
	const socket = useSocket();
	const [notifications, setNotifications] = useState([]);

	useEffect(() => {
		if (userData && socket) {
			socket.emit("joinNotifications", {
				userId: userData._id,
			});
		}
	}, [userData, socket]);

	useEffect(() => {
		if (!socket) return;

		const handleNotifications = ({
			notification_id,
			photoId,
			senderId,
			sender_name,
			imageId,
			type,
			isRead,
			time,
		}) => {
			setNotifications((prevNotifications) => [
				...prevNotifications,
				{
					notification_id,
					photoId,
					senderId,
					sender_name,
					imageId,
					type,
					isRead,
					time,
				},
			]);
		};

		socket.on("newNotification", handleNotifications);

		return () => {
			socket.off("newNotification", handleNotifications);
		};
	}, [socket]);

	return (
		<div>
			<NavBar
				notifications={notifications}
				setNotifications={setNotifications}
			/>
			<Outlet />
		</div>
	);
};

export default MainContent;
