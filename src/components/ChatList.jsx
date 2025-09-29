import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const ChatList = () => {
	const user = useSelector((store) => store.auth.user);
	const [allChats, setAllChats] = useState([]);
	const getAllChats = async () => {
		try {
			const allTheChats = await axios.get(BASE_URL + "/chat/allChats", {
				withCredentials: true,
			});
			console.log(allTheChats.data);

			setAllChats(allTheChats.data);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		if (user) {
			getAllChats();
		}
	}, [user]);

	return (
		<div className="flex justify-center m-4 px-4 w-full mx-auto space-y-4">
			<ul className="list bg-base-100 rounded-box shadow-md">
				<li className="p-4 pb-2 text-xs opacity-60 tracking-wide">Chat list</li>
				{/* {allChats.map((chat) => {
					const otherParticipant = chat.participants.find(
						(p) => p.user._id.toString() !== user._id.toString()
					);
					const loggedUser = chat.participants.find(
						(p) => p.user._id.toString() === user._id.toString()
					);
					if (otherParticipant) {
						const targetUserId = otherParticipant.user._id;
						const targetUserName = otherParticipant.user.userName;
						return (
							<li key={chat._id} className="list-row">
								<Link
									to={"/chat/" + targetUserId + "/" + targetUserName}
									className="flex items-center w-full gap-60 p-4 hover:bg-base-200 transition-colors"
								>
									<div className="flex items-center w-full gap-4 p-4 hover:bg-base-200 transition-colors">
										<div>
											<img
												className="size-10 rounded-box"
												src={otherParticipant.user.photoUrl}
											/>
										</div>
										<div>
											<div>{targetUserName}</div>
										</div>
									</div>

									<label>{chat.unreadCount > 0 && chat.unreadCount}</label>
								</Link>
							</li>
						);
					} else if (loggedUser) {
						return (
							<li key={chat._id} className="list-row">
								<Link
									to={
										"/chat/" +
										loggedUser.user._id +
										"/" +
										loggedUser.user.userName
									}
									className="flex items-center w-full gap-60 p-4 hover:bg-base-200 transition-colors"
								>
									<div className="flex items-center w-full gap-4 p-4 hover:bg-base-200 transition-colors">
										<div>
											<img
												className="size-10 rounded-box"
												src={loggedUser.user.photoUrl}
											/>
										</div>
										<div>
											<div>{loggedUser.user.userName}</div>
										</div>
									</div>

									<label>{chat.unreadCount > 0 && chat.unreadCount}</label>
								</Link>
							</li>
						);
					}
				})} */}
			</ul>
		</div>
	);
};

export default ChatList;
