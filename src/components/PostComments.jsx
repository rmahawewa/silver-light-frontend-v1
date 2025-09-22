import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { format, isToday, isYesterday } from "date-fns";
import SendFriendRequest from "./UserFunctions/SendFriendRequest";
import { useDispatch, useSelector } from "react-redux";
import GetConnectionStatus from "./UserFunctions/GetConnectionStatus";
import { Link } from "react-router-dom";

const PostComments = ({ postId }) => {
	const [comment, setComment] = useState("");
	const [postComments, setPostComments] = useState([]);
	const [rootComments, setRootComments] = useState([]);

	useEffect(() => {
		getPostComments();
	}, []);

	useEffect(() => {
		const rComments =
			postComments.length > 0 &&
			postComments.filter((c) => c.parentCommentId === null).map((c) => c._id);
		setRootComments(rComments);
		console.log(rComments);
	}, [postComments]);

	const getPostComments = async () => {
		try {
			const res = await axios.get(BASE_URL + "/postcomment/" + postId, {
				withCredentials: true,
			});
			console.log(res.data.data);
			setPostComments(res.data.data);
		} catch (err) {
			console.log(err);
		}
	};

	const saveComment = async (parentCommentId, event) => {
		try {
			if (event.key === "Enter") {
				const res = await axios.post(
					BASE_URL + "/postcomment/save",
					{ postId, parentCommentId, comment },
					{ withCredentials: true }
				);
				if (res) {
					getPostComments();
					setComment("");
				}
			}
		} catch (err) {
			console.log(err);
		}
	};
	return (
		<div>
			<input
				type="text"
				placeholder="Add a new coment"
				className="input my-5 w-full"
				value={comment}
				onChange={(e) => setComment(e.target.value)}
				onKeyUp={(e) => saveComment(0, e)}
			/>

			{rootComments && rootComments.length > 0 ? (
				<>
					<ol>
						{rootComments.map((id) => (
							<div key={id} className="my-5">
								<CommentTree
									key={id}
									postId={postId}
									commentId={id}
									comments={postComments}
									findPostComments={getPostComments}
								/>
							</div>
						))}
					</ol>
				</>
			) : (
				<div>No comments yet</div>
			)}
		</div>
	);
};

const CommentTree = ({ postId, commentId, comments, findPostComments }) => {
	const currentComment = comments?.find((c) => c._id === commentId);
	const childCommentIds = currentComment?.childCommentIds;
	const [replyId, setReplyId] = useState("");
	const [commentedByUser, setCommentedByUser] = useState("");
	const commentDate = isToday(currentComment?.createdAt)
		? "Today"
		: isYesterday(currentComment?.createdAt)
		? "Yesterday"
		: // : format(currentComment?.createdAt, "yyyy/MM/dd");
		  currentComment?.createdAt;

	// const user = useSelector((store) => store.user)?._id;
	const user = useSelector((store) => store.auth.user)?._id;
	const dispatch = useDispatch();
	const userConnections = useSelector((store) => store.connectionfeed);

	const handleReplyId = (id) => {
		setReplyId(id);
	};

	const findCommentedByUser = () => {
		const userId = comments.filter((c) => c._id === commentId)[0].commentByUser
			._id;
		setCommentedByUser(userId);
	};

	useEffect(() => {
		try {
			findCommentedByUser();
		} catch (err) {
			console.error(err);
		}
	}, []);

	return (
		<li>
			<div className="">
				<div>
					<div className="flex justify-between w-full py-4 input input-xs text-primary">
						<div>{currentComment?.commentByUser?.userName}</div>
						<div>{commentDate}</div>
						<div>
							<Link
								to={
									"/chat/" +
									currentComment?.commentByUser?._id +
									"/" +
									currentComment?.commentByUser?.userName
								}
								className="btn btn-square btn-ghost btn-xs mx-1"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 16 16"
									fill="currentColor"
									className="size-4"
								>
									<path
										fillRule="evenodd"
										d="M1 8.74c0 .983.713 1.825 1.69 1.943.764.092 1.534.164 2.31.216v2.351a.75.75 0 0 0 1.28.53l2.51-2.51c.182-.181.427-.286.684-.294a44.298 44.298 0 0 0 3.837-.293C14.287 10.565 15 9.723 15 8.74V4.26c0-.983-.713-1.825-1.69-1.943a44.447 44.447 0 0 0-10.62 0C1.712 2.435 1 3.277 1 4.26v4.482ZM5.5 6.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm2.5 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm3.5 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
										clipRule="evenodd"
									/>
								</svg>
							</Link>
							{/* </div>
						<div> */}

							{!GetConnectionStatus(commentedByUser, userConnections) &&
								!(user === commentedByUser) && (
									<button
										className="btn btn-square btn-ghost btn-xs mx-1"
										onClick={() => SendFriendRequest(dispatch, commentedByUser)}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 16 16"
											fill="currentColor"
											className="size-4"
										>
											<path d="M8.5 4.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM10 13c.552 0 1.01-.452.9-.994a5.002 5.002 0 0 0-9.802 0c-.109.542.35.994.902.994h8ZM12.5 3.5a.75.75 0 0 1 .75.75v1h1a.75.75 0 0 1 0 1.5h-1v1a.75.75 0 0 1-1.5 0v-1h-1a.75.75 0 0 1 0-1.5h1v-1a.75.75 0 0 1 .75-.75Z" />
										</svg>
									</button>
								)}
						</div>
					</div>
					<div className="flex justify-between w-full input input-m">
						{currentComment?.comment + " "}
						<span
							className="cursor-pointer"
							onClick={() => handleReplyId(currentComment?._id)}
						>
							Reply
						</span>
					</div>
				</div>

				{replyId === currentComment?._id && (
					<div>
						<Reply
							postId={postId}
							parentId={commentId}
							changeReplyId={handleReplyId}
							findPostComments={findPostComments}
						/>
					</div>
				)}

				{childCommentIds?.length > 0 && (
					<div className="collapse bg-base-100 border-base-300 border">
						<input type="checkbox" />
						<div className="collapse-title font-semibold">
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
									d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
								/>
							</svg>
						</div>
						<div className="collapse-content text-sm">
							<ol>
								{childCommentIds?.map((childId) => (
									<CommentTree
										key={childId}
										postId={postId}
										commentId={childId}
										comments={comments}
										findPostComments={findPostComments}
									/>
								))}
							</ol>
						</div>
					</div>
				)}
			</div>
		</li>
	);
};

const Reply = ({ postId, parentId, changeReplyId, findPostComments }) => {
	const [reply, setReply] = useState("");

	const saveComment = async (event) => {
		try {
			if (event.key === "Enter") {
				const res = await axios.post(
					BASE_URL + "/postcomment/save",
					{ postId, parentCommentId: parentId, comment: reply },
					{ withCredentials: true }
				);
				if (res) {
					findPostComments();
					setReply("");
					changeReplyId("");
				}
			}
		} catch (err) {}
	};
	return (
		<p>
			<input
				type="text"
				placeholder="Reply"
				className="input my-5 w-full"
				value={reply}
				onChange={(e) => setReply(e.target.value)}
				onKeyUp={(e) => saveComment(e)}
			/>
		</p>
	);
};

export default PostComments;
