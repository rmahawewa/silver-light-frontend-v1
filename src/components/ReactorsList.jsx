import React from "react";
import GetConnectionStatus from "./UserFunctions/GetConnectionStatus";
import ConnectionRequest from "./icons/ConnectionRequest";
import Message from "./icons/Message";
import SendFriendRequest from "./UserFunctions/SendFriendRequest";
import { Link } from "react-router-dom";
import ActiveMessage from "./icons/ActiveMessage";

const ReactorsList = ({
	user,
	reaction,
	reactors,
	userConnections,
	dispatch,
}) => {
	return (
		<>
			<div className="modal-box">
				<ul className="list bg-base-100 rounded-box">
					<li className="p-4 pb-2 text-s opacity-60 tracking-wide">
						<span className="font-bold">{reaction}</span>'s by,
					</li>
				</ul>
				<div className="max-h-96 overflow-y-auto">
					<ul className="list bg-base-100 rounded-box">
						{reactors?.length > 0 ? (
							reactors?.map((r) => (
								<li key={r._id} className="list-row">
									<div>
										<img
											className="size-10 rounded-box"
											src={r.photoUrl}
											alt={`${r.userName}'s information`}
										/>
									</div>
									<div>
										<div>{r.userName}</div>
									</div>
									{reaction !== "iFeelJelousy" && (
										<>
											<Link to={"/chat/" + r._id + "/" + r.userName}>
												<ActiveMessage />
											</Link>
											{!GetConnectionStatus(r._id, userConnections) &&
											r._id !== user._id ? (
												<button
													className="btn btn-square btn-ghost"
													onClick={() => SendFriendRequest(dispatch, r._id)}
												>
													<ConnectionRequest />
												</button>
											) : (
												r._id !== user._id && (
													<span className="py-1">
														<Message />
													</span>
												)
											)}
										</>
									)}
								</li>
							))
						) : (
							<li className="p-4 text-center text-sm opacity-70">
								No users found with for this reaction.
							</li>
						)}
					</ul>
				</div>
			</div>
			<form method="dialog" className="modal-backdrop">
				<button>close</button>
			</form>
		</>
	);
};

export default ReactorsList;
