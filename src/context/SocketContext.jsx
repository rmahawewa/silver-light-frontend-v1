import React, { createContext, useContext, useEffect, useState } from "react";
import { createSocketConnection } from "../utils/socket"; // Utility function

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);

	useEffect(() => {
		//Create the single socket connection when the provider mounts
		const newSocket = createSocketConnection();
		setSocket(newSocket);

		// Clean up the connection on unmount
		return () => {
			newSocket.disconnect();
		};
	}, []);

	return (
		<SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
	);
};

export const useSocket = () => {
	const socket = useContext(SocketContext);
	if (socket === undefined) {
		throw new Error("useSocket must be used within a SocketProvider");
	}
	return socket;
};
