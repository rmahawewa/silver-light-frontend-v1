import React from "react";
import Connections from "./Connections";

const AllRequests = () => {
	return (
		<div className="flex justify-between w-full flex-col sm:flex-row ">
			<Connections status={"accepted"} />
			<Connections status={"sent"} />
		</div>
	);
};

export default AllRequests;
