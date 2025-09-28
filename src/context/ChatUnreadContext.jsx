// ChatUnreadContext.js
import React, { createContext, useContext, useState, useMemo } from "react";

const ChatUnreadContext = createContext();

export const useChatUnread = () => useContext(ChatUnreadContext);

export const ChatUnreadProvider = ({ children }) => {
	// State to hold unread counts, keyed by the other user's ID: { otherUserId: count, ... }
	const [chatUnreadCounts, setChatUnreadCounts] = useState({});

	// Calculate the total unread count for the NavBar badge
	const totalChatUnreadCount = useMemo(
		() =>
			Object.values(chatUnreadCounts).reduce(
				(total, count) => total + count,
				0
			),
		[chatUnreadCounts]
	);

	// Function to set the count for a specific chat
	const setChatUnreadCount = (chatId, count) => {
		setChatUnreadCounts((prevCounts) => ({
			...prevCounts,
			[chatId]: count,
		}));
	};

	// Function to clear the count for a specific chat (e.g., when the user opens it)
	const clearChatUnreadCount = (chatId) => {
		setChatUnreadCount(chatId, 0);
	};

	// Function to increment the count for a specific chat (e.g., on new message socket event)
	const incrementChatUnreadCount = (chatId) => {
		setChatUnreadCounts((prevCounts) => ({
			...prevCounts,
			[chatId]: (prevCounts[chatId] || 0) + 1,
		}));
	};

	const contextValue = {
		chatUnreadCounts,
		totalChatUnreadCount,
		setChatUnreadCount,
		clearChatUnreadCount,
		incrementChatUnreadCount,
	};

	return (
		<ChatUnreadContext.Provider value={contextValue}>
			{children}
		</ChatUnreadContext.Provider>
	);
};
