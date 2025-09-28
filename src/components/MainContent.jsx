import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import { useSocket } from "../context/SocketContext";
import { useDispatch, useSelector } from "react-redux";
import {
	addInitiallyFromDB,
	addNotifications,
	addOneNotification,
} from "../utils/notificationSlice";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useChatUnread } from "../context/ChatUnreadContext";

const MainContent = () => {
	// const userData = useSelector((store) => store.user);
	const userData = useSelector((store) => store.auth.user);
	const socket = useSocket();
	// const [notifications, setNotifications] = useState([]);
	const dispatch = useDispatch();
	const notifications = useSelector((store) => store?.notificationfeed);
	const { setChatUnreadCount } = useChatUnread(); // 💡 Get the context setter

	// New function to fetch initial unread counts for all chats
	const fetchInitialChatUnreads = async () => {
		try {
			const res = await axios.get(BASE_URL + "/chat/allChats", {
				withCredentials: true,
			});
			const chats = res.data;

			// Map over the chats and initialize the context state
			chats.forEach((chat) => {
				const otherParticipant = chat.participants.find(
					(p) => p.user._id.toString() !== userData._id.toString()
				);

				if (otherParticipant && chat.unreadCount !== undefined) {
					// Use the other user's ID as the unique key for the chat
					const chatIdKey = otherParticipant.user._id;
					setChatUnreadCount(chatIdKey, chat.unreadCount);
				}
			});
		} catch (err) {
			console.error("Error fetching initial chat unreads:", err);
		}
	};

	useEffect(() => {
		if (userData) {
			// Fetch initial data for chat unread counts when user loads
			fetchInitialChatUnreads();
			unreadNotifications();
		}
	}, [userData]);

	const unreadNotifications = async () => {
		try {
			const res = await axios.get(BASE_URL + "/notifications/unread", {
				withCredentials: true,
			});
			console.log(res.data.data);
			const unreadNotifications = res.data.data;
			if (!notifications) {
				dispatch(addInitiallyFromDB(unreadNotifications));
			} else {
				unreadNotifications.map((n) => {
					const isPresent = notifications.some((elem) => elem._id === n._id);
					if (!isPresent) dispatch(addOneNotification(n));
				});
			}
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		if (userData) {
			unreadNotifications();
		}
	}, [userData]);

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
			// _id,
			_id,
			recipientId,
			senderId,
			// sender_name,
			imageId,
			postId,
			commentId,
			type,
			value,
			isRead,
			category,
			createdAt,
		}) => {
			if (!notifications) {
				dispatch(
					addNotifications({
						_id,
						recipientId,
						senderId,
						imageId,
						postId,
						commentId,
						type,
						value,
						isRead,
						category,
						createdAt,
					})
				);
			} else {
				const isPresent = notifications.some((elem) => elem._id === _id);
				if (!isPresent) {
					dispatch(
						addOneNotification({
							_id,
							recipientId,
							senderId,
							imageId,
							postId,
							commentId,
							type,
							value,
							isRead,
							category,
							createdAt,
						})
					);
				}
			}
		};

		socket.on("newNotification", handleNotifications);

		return () => {
			socket.off("newNotification", handleNotifications);
		};
	}, [socket, notifications, dispatch]);

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
