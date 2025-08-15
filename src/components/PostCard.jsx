import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { savepostreaction } from "../utils/postSlice";
import { addNewConnectionRequest } from "../utils/connectionRequestSlice";
import PostComments from "./PostComments";
// import ConnectionRequest from "./icons/ConnectionRequest";
// import Message from "./icons/Message";
import {
	Like,
	Love,
	Familier,
	True,
	Wonderful,
	IFeelJelousy,
} from "./icons/Reactions";
// import GetConnectionStatus from "./UserFunctions/GetConnectionStatus";
import ReactorsList from "./ReactorsList";

const PostCard = ({ postId }) => {
	const user = useSelector((store) => store.user);
	const [reaction, setReaction] = useState("");
	const [reactors, setReactors] = useState([]);
	// const [comment, setComment] = useState("");
	// const [postComments, setPostComments] = useState([]);
	const dispatch = useDispatch();
	const post = useSelector((store) =>
		store.postfeed.find((pt) => pt._id === postId)
	);
	const userConnections = useSelector((store) => store.connectionfeed);
	const modalId = `reactions_modal_${postId}`;

	useEffect(() => {
		// console.log(`ImageCard for Image ID: ${imageId}`);
		// console.log("Image object from Redux:", image);
		if (post && !post.post_reactions) {
			console.warn(`Post ID ${postId} is missing 'post_reactions' array!`);
		} else if (
			post &&
			post.post_reactions &&
			post.post_reactions.length === 0
		) {
			console.log(`Post ID ${postId} has an empty 'post_reactions' array.`);
		}
		// console.log(userConnections);

		console.log(post);
	}, [post, postId, userConnections]);

	const findSimilarReactionCount = (type) => {
		const result = post.post_reactions.filter((r) => r.reactionType === type);
		return result.length;
		// console.log(image);
		// console.log(reaction);
		// setReactionCount(result.length);
	};

	useEffect(() => {
		if (post && user?._id) {
			// console.log(image);
			const userReaction = post?.post_reactions?.find(
				(r) => r.reactedById === user._id
			);
			if (userReaction) {
				setReaction(userReaction.reactionType);
			}
		}
		// findSimilarReactionCount();
	}, [post, user]);

	const saveReaction = async (r) => {
		try {
			if (reaction === r) {
				r = "undo";
				setReaction("");
			} else {
				setReaction(r);
			}
			const res = await axios.post(
				BASE_URL + "/postreaction/save",
				{ postId: postId, reaction: r },
				{ withCredentials: true }
			);
			console.log(res);
			dispatch(savepostreaction(res.data.data));
			// findSimilarReactionCount();
		} catch (err) {
			console.error(err);
		}
	};

	const getSimillarReactionsForTheImage = async (r) => {
		const reactionArray = [];

		if (!post || !post.post_reactions) {
			console.warn(
				`Cannot get similar reactions for image ID ${postId}: image or reactions data is missing.`
			);
			setReactors([]); // Ensure reactors is empty if data is not available
			document.getElementById("my_modal_2").showModal(); // Show modal with "No users found"
			return; // Exit early
		}

		post.post_reactions.forEach((reaction) => {
			if (reaction.reactionType === r) {
				reactionArray.push(reaction.reactedById);
			}
		});
		const res = await axios.post(
			BASE_URL + "/reaction/getreactor",
			{ reactedByIds: reactionArray },
			{ withCredentials: true }
		);
		setReactors(res.data.data);
	};

	useEffect(() => {
		// console.log(reactors);
		if (reactors.length > 0) document.getElementById(modalId).showModal();
	}, [reactors]);

	const sendFriendRequest = async (receiverId) => {
		try {
			const responce = await axios.post(
				BASE_URL + "/request/send",
				{ toUserId: receiverId },
				{ withCredentials: true }
			);
			console.log(responce);
			dispatch(addNewConnectionRequest(responce.data.data));
		} catch (err) {}
	};

	return (
		<>
			<div className="card bg-base-100 w-200 shadow-sm">
				{post && post.photos && (
					<figure>
						<div className="carousel w-full">
							{post.photos.map((p, index) => (
								<div
									key={p._id}
									id={"slide" + (index + 1)}
									className="carousel-item relative w-full"
								>
									{/* {"test" + index} */}
									<img
										src={p.url}
										className="w-full object-cover"
										style={{ maxHeight: "40em", aspectRatio: "20/9" }}
										alt={p.photoTitle}
									/>

									{post.photos.length > 1 && (
										<div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
											<a
												href={
													index === 0
														? "#slide" + post.photos.length
														: "#slide" + index
												}
												className="btn btn-circle"
											>
												❮
											</a>
											<a
												href={
													index === post.photos.length - 1
														? "#slide1"
														: "#slide" + Number(index + 2)
												}
												className="btn btn-circle"
											>
												❯
											</a>
										</div>
									)}
								</div>
							))}
						</div>
					</figure>
				)}

				<div className="card-body">
					<h2 className="card-title">{post.title}</h2>
					<p>{post.description}</p>
					<p>
						{post.category.map((c, i) => (
							<span key={i}>#{c} </span>
						))}
					</p>
					<div className="card-actions justify-end py-5">
						<button
							onClick={() => saveReaction("like")}
							className={
								reaction === "like"
									? "btn btn-soft btn-primary"
									: "btn btn-primary"
							}
						>
							<Like />
							Like
						</button>
						<button
							onClick={() => saveReaction("familier")}
							className={
								reaction === "familier"
									? "btn btn-soft btn-primary"
									: "btn btn-primary"
							}
						>
							<Familier />
							Familier
						</button>
						<button
							onClick={() => saveReaction("love")}
							className={
								reaction === "love"
									? "btn btn-soft btn-primary"
									: "btn btn-primary"
							}
						>
							<Love />
							Love
						</button>
						<button
							onClick={() => saveReaction("aTrue")}
							className={
								reaction === "aTrue"
									? "btn btn-soft btn-primary"
									: "btn btn-primary"
							}
						>
							<True />
							True
						</button>
						<button
							onClick={() => saveReaction("wonderful")}
							className={
								reaction === "wonderful"
									? "btn btn-soft btn-primary"
									: "btn btn-primary"
							}
						>
							<Wonderful />
							Wonderful
						</button>
						<button
							onClick={() => saveReaction("iFeelJelousy")}
							className={
								reaction === "iFeelJelousy"
									? "btn btn-soft btn-primary"
									: "btn btn-primary"
							}
						>
							<IFeelJelousy />I feel jelousy
						</button>
					</div>
					{!(reaction === "" || reaction === "undo") && (
						<p
							onClick={() => getSimillarReactionsForTheImage(reaction)}
							className="cursor-pointer"
						>
							View {findSimilarReactionCount(reaction)} simillar reactions
						</p>
					)}
					<div className="postComments my-5">
						<PostComments postId={postId} />
					</div>
				</div>
			</div>
			<dialog id={modalId} className="modal">
				{/* <div className="modal-box">
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
												<button className="btn btn-square btn-ghost">
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
															d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
														/>
													</svg>
												</button>
												{!GetConnectionStatus(r._id, userConnections) &&
												r._id !== user._id ? (
													<button
														className="btn btn-square btn-ghost"
														onClick={() => sendFriendRequest(dispatch, r._id)}
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
				</form> */}
				<ReactorsList
					user={user}
					reaction={reaction}
					reactors={reactors}
					userConnections={userConnections}
					dispatch={dispatch}
				/>
			</dialog>
		</>
	);
};

export default PostCard;
