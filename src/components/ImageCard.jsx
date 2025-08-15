import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { savereaction } from "../utils/imageSlice";
import { addNewConnectionRequest } from "../utils/connectionRequestSlice";
import ConnectionRequest from "./icons/ConnectionRequest";
import Message from "./icons/Message";
import {
	Like,
	Love,
	Familier,
	True,
	Wonderful,
	IFeelJelousy,
} from "./icons/Reactions";
import SendFriendRequest from "./UserFunctions/SendFriendRequest";
import GetConnectionStatus from "./UserFunctions/GetConnectionStatus";
import ReactorsList from "./ReactorsList";

const ImageCard = ({ imageId }) => {
	const user = useSelector((store) => store.user);
	const [reaction, setReaction] = useState("");
	const [reactors, setReactors] = useState([]);
	// const [reactionCount, setReactionCount] = useState(0);
	const dispatch = useDispatch();
	const userConnections = useSelector((store) => store.connectionfeed);
	const image = useSelector((store) =>
		store.imagefeed.find((img) => img._id === imageId)
	);

	// console.log(userConnections);
	const modalId = `reactions_modal_${imageId}`;

	useEffect(() => {
		// console.log(`ImageCard for Image ID: ${imageId}`);
		// console.log("Image object from Redux:", image);
		if (image && !image.reactions) {
			console.warn(`Image ID ${imageId} is missing 'reactions' array!`);
		} else if (image && image.reactions && image.reactions.length === 0) {
			console.log(`Image ID ${imageId} has an empty 'reactions' array.`);
		}
	}, [image, imageId, userConnections]);

	const findSimilarReactionCount = (type) => {
		const result = image.reactions.filter((r) => r.reactionType === type);
		return result.length;
	};

	useEffect(() => {
		if (image && user?._id) {
			const userReaction = image?.reactions?.find(
				(r) => r.reactedById === user._id
			);
			if (userReaction) {
				setReaction(userReaction.reactionType);
			}
		}
	}, [image, user]);

	const saveReaction = async (r) => {
		try {
			if (reaction === r) {
				r = "undo";
				setReaction("");
			} else {
				setReaction(r);
			}
			const res = await axios.post(
				BASE_URL + "/reaction/save",
				{ photoId: image._id, reaction: r },
				{ withCredentials: true }
			);
			dispatch(savereaction(res.data.data));
			// findSimilarReactionCount();
		} catch (err) {
			console.error(err);
		}
	};

	const getSimillarReactionsForTheImage = async (r) => {
		const reactionArray = [];

		if (!image || !image.reactions) {
			console.warn(
				`Cannot get similar reactions for image ID ${imageId}: image or reactions data is missing.`
			);
			setReactors([]); // Ensure reactors is empty if data is not available
			document.getElementById("my_modal_2").showModal(); // Show modal with "No users found"
			return; // Exit early
		}

		image.reactions.forEach((reaction) => {
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

	return (
		<>
			<div className="card bg-base-100 w-200 shadow-sm">
				<figure>
					<img
						// src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
						src={image.url}
						alt="Shoes"
					/>
				</figure>
				<div className="card-body">
					<h2 className="card-title">{image.photoTitle}</h2>
					<p>{image.photoDescription}</p>
					<p>
						{image.category.map((c, i) => (
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
				</div>
			</div>
			<dialog id={modalId} className="modal">
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

export default ImageCard;
