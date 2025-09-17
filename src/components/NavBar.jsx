import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { logout } from "../utils/authSlice";
import axios from "axios";
import NewImage from "./NewImage";
import NewPost from "./NewPost";
import Categories from "./Categories";
import saveVisitedUserInformation from "./UserFunctions/GetPageVisitedTime";
import { removeConnections } from "../utils/connectionRequestSlice";
import { removePosts } from "../utils/postSlice";
import { removeImage } from "../utils/imageSlice";
import { useSocket } from "../context/SocketContext";

const NavBar = () => {
	const socket = useSocket();
	// Select the user from the auth slice
	const user = useSelector((store) => store.auth.user);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [itemSwitch, setItemSwitch] = useState("");
	const [post_id, setPostid] = useState("");
	const [imageId, setImageId] = useState("");
	const [lastVisitedTime, setLastVisitedTime] = useState("");
	const [notifications, setNotifications] = useState([]);

	const loggedInUsr = user?._id;

	const connections = useSelector((store) => store?.connectionfeed)?.filter(
		(c) => c?.createdAt > lastVisitedTime && c?.status === "accepted"
	);

	const handlePostidChange = (value) => {
		setPostid(value);
	};

	const handleImageIdChange = (value) => {
		setImageId(value);
	};

	const handleLogout = async () => {
		try {
			await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });

			// Dispatch the single logout action
			dispatch(logout());

			// These other dispatches might also be handled by a global logout action if you want to centralize things further
			dispatch(removeConnections());
			dispatch(removePosts());
			dispatch(removeImage());

			return navigate("/login");
		} catch (err) {
			console.error(err.message);
		}
	};

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
		user && processLastVisitedTime();
	}, [loggedInUsr]); // Add user and loggedInUsr to the dependency array

	useEffect(() => {
		if (!socket) return;

		const handleNotifications = ({
			notification_id,
			senderId,
			sender_name,
			imageId,
			type,
			isRead,
			time,
		}) => {
			setNotifications((prevNotifications) => [
				...prevNotifications,
				{ notification_id, senderId, sender_name, imageId, type, isRead, time },
			]);
		};

		socket.on("newNotification", handleNotifications);

		return () => {
			socket.off("newNotification", handleNotifications);
		};
	}, [loggedInUsr, socket]);

	return (
		// The rest of your component remains the same
		<>
			<div className="navbar bg-base-100 shadow-sm">
				<div className="flex-1">
					<Link to="/" className="btn btn-ghost text-3xl">
						miraculous
					</Link>
				</div>
				{user && (
					<div className="hidden flex-none lg:block">
						<div className="dropdown dropdown-hover">
							<button className="btn btn-ghost btn-circle">
								<div className="indicator">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										{" "}
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
										/>{" "}
									</svg>
									<span className="badge badge-xs badge-primary indicator-item">
										{notifications.length} {/* 5  number of notifications */}
									</span>
								</div>
							</button>
							<ul
								tabIndex={0}
								className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
							>
								{notifications &&
									notifications.map((notification) => (
										<li key={notification.notification_id}>
											{notification.type == "reaction" && (
												<>
													<span
													// onClick={() => {
													// 	handleImageIdChange("");
													// 	setItemSwitch("image");
													// 	document.getElementById("my_modal_1").showModal();
													// }}
													>
														{notification.sender_name +
															" reacted to your collaboration."}
													</span>
													<span>{notification.time}</span>
												</>
											)}
											{notification.type == "comment" && (
												<>
													<span
													// onClick={() => {
													// 	handleImageIdChange("");
													// 	setItemSwitch("image");
													// 	document.getElementById("my_modal_1").showModal();
													// }}
													>
														{notification.sender_name +
															" commented on your collaboration."}
													</span>
													<span>{notification.time}</span>
												</>
											)}
											{/* {notification.type == "message" && ()} */}
										</li>
									))}
								<li>
									<span
										onClick={() => {
											handleImageIdChange("");
											setItemSwitch("image");
											document.getElementById("my_modal_1").showModal();
										}}
									>
										New image
									</span>
								</li>
								<li>
									<span
										onClick={() => {
											handlePostidChange("");
											setItemSwitch("post");
											document.getElementById("my_modal_1").showModal();
										}}
									>
										New post
									</span>
								</li>
							</ul>
						</div>
						<div className="dropdown dropdown-hover">
							<button className="btn btn-ghost btn-circle">
								<div className="indicator">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="currentColor"
										className="size-6"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M12 4.5v15m7.5-7.5h-15"
										/>
									</svg>
								</div>
							</button>
							<ul
								tabIndex={0}
								className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
							>
								<li>
									<span
										onClick={() => {
											handleImageIdChange("");
											setItemSwitch("image");
											document.getElementById("my_modal_1").showModal();
										}}
									>
										New image
									</span>
								</li>
								<li>
									<span
										onClick={() => {
											handlePostidChange("");
											setItemSwitch("post");
											document.getElementById("my_modal_1").showModal();
										}}
									>
										New post
									</span>
								</li>
							</ul>
						</div>
						<button
							className="btn btn-ghost btn-circle tooltip tooltip-left tooltip-primary"
							data-tip="Categories"
							onClick={() => {
								document.getElementById("modal_categories").showModal();
							}}
						>
							<div className="indicator">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={1.5}
									stroke="currentColor"
									className="size-6"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
									/>
								</svg>
							</div>
						</button>

						<div className="dropdown dropdown-end mx-5">
							<div
								tabIndex={0}
								role="button"
								className="btn btn-ghost btn-circle avatar"
							>
								<div className="w-10 rounded-full">
									<img
										alt={user.firstName + " " + user.lastName}
										src={user.photoUrl}
									/>
								</div>
							</div>
							<ul
								tabIndex={0}
								className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
							>
								<li>
									<Link to="/profile">{user.userName}</Link>
								</li>
								<li>
									<Link to="/connections" className="justify-between">
										Connections
									</Link>
								</li>
								<li>
									<Link to="/conn-requests">Conn requests</Link>
								</li>
								<li>
									<Link to="/settings">Settings</Link>
								</li>
								<li>
									<a onClick={handleLogout}>Logout</a>
								</li>
							</ul>
						</div>
					</div>
				)}
			</div>
			{/* ... modal content ... */}
			<dialog id="my_modal_1" className="modal">
				<div className="modal-box w-11/12 max-w-5xl">
					{itemSwitch === "image" && (
						<NewImage
							imageId={imageId}
							handleImageIdChange={handleImageIdChange}
						/>
					)}
					{itemSwitch === "post" && (
						<NewPost
							post_id={post_id}
							handlePostidChange={handlePostidChange}
						/>
					)}
					<div className="modal-action">
						<form method="dialog">
							<div>
								<button className="btn">Close</button>
							</div>
						</form>
					</div>
				</div>
			</dialog>
			<dialog id="modal_categories" className="modal">
				<div className="modal-box">
					<ul className="list bg-base-100 rounded-box">
						<li className="p-4 pb-2 text-s  tracking-wide">
							<legend className="fieldset-legend text-2xl font-bold px-2">
								All the Categories
							</legend>
						</li>
					</ul>
					<div className="max-h-96 overflow-y-auto">
						<ul className="list bg-base-100 rounded-box">
							<Categories />
						</ul>
					</div>
				</div>
				<form method="dialog" className="modal-backdrop">
					<button>close</button>
				</form>
			</dialog>
		</>
	);
};

export default NavBar;
