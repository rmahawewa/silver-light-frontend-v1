import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import { useSocket } from "../context/SocketContext";

const Chat = () => {
	const socket = useSocket(); // Get the socket instance from context
	const { targetUserId, targetUserName } = useParams();

	const user = useSelector((store) => store.user);
	const [newMessage, setNewMessage] = useState("");
	const userId = user?._id;
	const [messages, setMessages] = useState([]);

	const fetchChatMessages = async () => {
		try {
			const chat = await axios.get(BASE_URL + "/chat/" + targetUserId, {
				withCredentials: true,
			});
			console.log(chat);
			const chatMessages = chat?.data?.messages.map((msg) => {
				const { createdAt, senderId, text } = msg;
				return {
					senderId: senderId?._id,
					firstName: senderId?.firstName,
					lastName: senderId?.lastName,
					userName: senderId?.userName,
					text,
					createdAt,
				};
			});
			setMessages(chatMessages);
			console.log(messages);
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		fetchChatMessages();
	}, []);

	useEffect(() => {
		if (!socket) return;
		// const socket = createSocketConnection();
		//As soon as the page loaded, the socket connection is made and joinChat event is emitted
		socket.emit("joinChat", {
			firstName: user.firstName,
			userId,
			targetUserId,
		});

		const handleMessage = ({ senderId, firstName, lastName, text }) => {
			setMessages((messages) => [
				...messages,
				{ senderId, firstName, lastName, text },
			]);
		};

		socket.on("messageReceived", handleMessage);

		return () => {
			socket.off("messageReceived", handleMessage);
		};

		// return () => {
		// 	socket.disconnect();
		// };
	}, [socket, userId, targetUserId]);

	const sendMessage = () => {
		// const socket = createSocketConnection();
		if (!socket) return;
		socket.emit("sendMessage", {
			firstName: user.firstName,
			lastName: user.lastName,
			userId,
			targetUserId,
			text: newMessage,
		});
		setNewMessage("");
	};

	return (
		<div className="w-1/2 mx-auto border border-gray-600 m-5 h-[70vh] flex flex-col rounded">
			<div className="p-5 border-b border-gray-600 rounded">
				<h1>Chat</h1>
				<h2>{targetUserName}</h2>
			</div>
			<div className="flex-1 overflow-scroll p-5 rounded">
				{messages.map((message, index) => {
					let direction =
						message.senderId === user._id ? "chat-end" : "chat-start";
					return (
						<div key={index} className={"chat " + direction}>
							<div className="chat-header">
								{message.firstName} {message.lastName}
								<time className="text-xs opacity-50">{message.createdAt}</time>
							</div>
							<div className="chat-bubble">{message.text}</div>
							{/* <div className="chat-footer opacity-50">Seen</div> */}
						</div>
					);
				})}
			</div>
			<div className="p-5 border-t border-gray-600 flex items-center gap-2 rounded">
				<input
					value={newMessage}
					onChange={(e) => setNewMessage(e.target.value)}
					className="flex-1 border border-gray-500 text-black rounded p-2"
				/>
				<button onClick={sendMessage} className="btn btn-primary">
					Send
				</button>
			</div>
		</div>
	);
};

export default Chat;
