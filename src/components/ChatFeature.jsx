import React from "react";
import ChatList from "./ChatList";
import Chat from "./Chat";

const ChatFeature = () => {
	return (
		// <div className="flex justify-between w-full flex-col sm:flex-row ">
		<div>
			<ChatList />
			<Chat />
		</div>
	);
};

export default ChatFeature;
