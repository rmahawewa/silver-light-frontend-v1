import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useSelector } from "react-redux";

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
		<div>
			<ul className="list bg-base-100 rounded-box shadow-md">
				<li className="p-4 pb-2 text-xs opacity-60 tracking-wide">Chat list</li>
				{allChats.map((chat) => {
					const otherParticipant = chat.participants.find(
						(p) => p._id !== user._id
					);
					const loggedUser = chat.participants.find((p) => p._id === user._id);
					if (otherParticipant) {
						return (
							<li key={chat._id} className="list-row">
								<div>
									<img
										className="size-10 rounded-box"
										src={otherParticipant.photoUrl}
									/>
								</div>
								<div>
									<div>{otherParticipant.userName}</div>
									{/* <div className="text-xs uppercase font-semibold opacity-60">
									Remaining Reason
								</div> */}
								</div>

								<label>7</label>
							</li>
						);
					} else if (loggedUser) {
						return (
							<li key={chat._id} className="list-row">
								<div>
									<img
										className="size-10 rounded-box"
										src={loggedUser.photoUrl}
									/>
								</div>
								<div>
									<div>{loggedUser.userName}</div>
									{/* <div className="text-xs uppercase font-semibold opacity-60">
									Remaining Reason
								</div> */}
								</div>

								<label>7</label>
							</li>
						);
					}
				})}
				;
			</ul>
		</div>
	);
};

export default ChatList;
