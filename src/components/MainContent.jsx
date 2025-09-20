import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import { useSocket } from "../context/SocketContext";
import { useDispatch, useSelector } from "react-redux";
import {
	addNotifications,
	addOneNotification,
} from "../utils/notificationSlice";

const MainContent = () => {
	const userData = useSelector((store) => store.user);
	const socket = useSocket();
	// const [notifications, setNotifications] = useState([]);
	const dispatch = useDispatch();
	const notifications = useSelector((store) => store?.notificationfeed);

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
			senderId,
			sender_name,
			imageId,
			postId,
			type,
			value,
			category,
			// isRead,
			time,
		}) => {
			if (notifications.length === 0) {
				dispatch(
					addNotifications({
						notification_id,
						senderId,
						sender_name,
						imageId,
						postId,
						type,
						value,
						category,
						// isRead,
						time,
					})
				);
			} else {
				dispatch(
					addOneNotification({
						notification_id,
						senderId,
						sender_name,
						imageId,
						postId,
						type,
						value,
						category,
						// isRead,
						time,
					})
				);
			}
		};

		socket.on("newNotification", handleNotifications);

		return () => {
			socket.off("newNotification", handleNotifications);
		};
	}, [socket, notifications.dispatch]);

	// useEffect(() => {
	// 	dispatch(addNotifications(notifications));
	// }, [notifications]);

	return (
		<div>
			<NavBar />
			<Outlet />
		</div>
	);
};

export default MainContent;
