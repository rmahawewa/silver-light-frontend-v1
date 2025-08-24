import React from "react";
// import { useSelector } from "react-redux";

const GetConnectionStatus = (userId, userConnections) => {
	// const userConnections = useSelector((store) => store.connectionfeed);
	return (
		userConnections?.length > 0 &&
		userConnections.find(
			(r) => r?.fromUserId?._id === userId || r?.toUserId?._id === userId
		)
	);
};

export default GetConnectionStatus;
