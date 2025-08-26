import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
	addConnectionFeed,
	saveRespond,
} from "../utils/connectionRequestSlice";
import Message from "./icons/Message";
import ActiveMessage from "./icons/ActiveMessage";
import saveVisitedUserInformation from "./UserFunctions/GetPageVisitedTime";

const Connections = ({ status }) => {
	const loggedInUsr = useSelector((store) => store.user)?._id;
	console.log(loggedInUsr);
	const connecs = useSelector((store) => store.connectionfeed)?.filter(
		(c) => c?.status === status
	);
	console.log(connecs);
	const [lastVisitedTime, setLastVisitedTime] = useState("");

	useEffect(() => {
		const processLastVisitedTime = async () => {
			try {
				const getLastVisitedTime = async () => {
					try {
						const siteUrl = window.location.href;
						const res = await axios.post(
							BASE_URL + "/lastvisited/get",
							{ loggedInUsr: loggedInUsr, siteUrl: siteUrl },
							{ withCredentials: true }
						);
						const createdAt = res?.data?.data[0]?.createdAt;
						setLastVisitedTime(createdAt);
						return createdAt;
					} catch (err) {
						console.error(err);
						return 0;
					}
				};
				const lastVisitedTime = await getLastVisitedTime();
				if (lastVisitedTime) {
					saveVisitedUserInformation();
					console.log(lastVisitedTime);
				} else {
					saveVisitedUserInformation();
				}
			} catch (err) {
				console.log(err);
			}
		};
		processLastVisitedTime();
	}, []);

	return (
		<div className="w-full m-10">
			<ul className="list bg-base-100 rounded-box shadow-md">
				<li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
					{status === "sent" ? "Pending connections" : "Connections"}
				</li>
				{connecs.length > 0 ? (
					connecs.map((c) => (
						<li className="" key={c._id}>
							{c.fromUserId._id === loggedInUsr ? (
								<ConnectionView
									cid={c._id}
									conn={c.toUserId}
									direction={"to"}
									status={status}
									createdAt={c.createdAt}
									lastvisitedtime={lastVisitedTime}
								/>
							) : (
								<ConnectionView
									cid={c._id}
									conn={c.fromUserId}
									direction={"from"}
									status={status}
									createdAt={c.createdAt}
									lastvisitedtime={lastVisitedTime}
								/>
							)}
						</li>
					))
				) : (
					<li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
						<div>Currently empty</div>
					</li>
				)}
			</ul>
		</div>
	);
};

const ConnectionView = ({
	cid,
	conn,
	direction,
	status,
	createdAt,
	lastvisitedtime,
}) => {
	const dispatch = useDispatch();
	const conReqs = useSelector((store) => store.connectionfeed);
	const respondToConnectionRequest = async (id, status) => {
		try {
			const res = await axios.post(
				BASE_URL + "/request/respond",
				{ response: status, requestId: id },
				{ withCredentials: true }
			);
			if (res) {
				dispatch(saveRespond(res.data.data));
			}
		} catch (err) {
			console.error(err);
		}
	};

	return (
		conReqs && (
			<>
				{new Date(createdAt).getTime() >
					new Date(lastvisitedtime).getTime() && (
					<div className="flex justify-between mx-4 w-full">
						<p>new</p>
					</div>
				)}
				<div className="flex justify-between m-4 px-4 w-full mx-auto">
					<div>
						<div className="flex items-center">
							<div>
								<img className="size-10 rounded-box" src={conn.photoUrl} />
							</div>
							<div className="px-5">
								<div>{conn.userName}</div>
								<div className="text-xs font-semibold opacity-60">
									Since: {conn.updatedAt}
								</div>
							</div>
						</div>
					</div>

					<div className="flex items-center justify-between gap-5 px-5">
						<button className="btn btn-square btn-ghost">
							<ActiveMessage />
						</button>
						{status === "sent" && (
							<div>
								{direction === "to" ? (
									<span>Pending</span>
								) : (
									<div className="flex items-center justify-between gap-3">
										<button
											className="btn btn-primary"
											onClick={() =>
												respondToConnectionRequest(cid, "accepted")
											}
										>
											Accept
										</button>
										<button
											className="btn btn-primary"
											onClick={() =>
												respondToConnectionRequest(cid, "rejected")
											}
										>
											Reject
										</button>
									</div>
								)}
							</div>
						)}
					</div>
				</div>
			</>
		)
	);
};

export default Connections;
