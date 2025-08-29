import React, { useEffect, memo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import ImageCard from "./ImageCard";
import PostCard from "./PostCard";
import { GetFeed, GetConnections } from "./UserFunctions/GetFeed";
import { useNavigate } from "react-router-dom";

// Memoize the child components
const MemoizedImageCard = memo(ImageCard);
const MemoizedPostCard = memo(PostCard);

const Feed = () => {
	const dispatch = useDispatch();
	const user = useSelector((store) => store.user);
	const feedData = useSelector((store) => store.imagefeed);
	const postData = useSelector((store) => store.postfeed);
	const category = "";
	console.log(feedData);
	console.log(postData);

	// Add a selector to check for the login status from a new auth slice
	const isLoggedIn = useSelector((store) => store.auth.isLoggedIn);
	const navigate = useNavigate();

	// Use useCallback to memoize the dispatch functions
	const getFeedMemoized = useCallback(() => {
		GetFeed(dispatch, category);
	}, [dispatch, category]);

	const getConnectionsMemoized = useCallback(() => {
		GetConnections(dispatch);
	}, [dispatch]);

	useEffect(() => {
		getFeedMemoized();
		getConnectionsMemoized();
	}, [getFeedMemoized, getConnectionsMemoized]);

	// Use a new useEffect to watch for authentication status changes
	useEffect(() => {
		// Redirect to login if the user is not authenticated
		if (isLoggedIn === false) {
			navigate("/login");
		}
	}, [isLoggedIn, navigate]);

	if (!feedData) return null; // Use null for no content
	if (feedData.length === 0 && (!postData || postData.length === 0))
		return <h1 className="flex justify-center my-10">Feed is empty</h1>;

	return (
		<>
			{feedData &&
				feedData.length > 0 &&
				feedData.map((img) => (
					<div key={img._id} className=" flex justify-center py-10">
						<MemoizedImageCard imageId={img._id} />
					</div>
				))}
			{postData &&
				postData.length > 0 &&
				postData.map((post) => (
					<div key={post._id} className="flex justify-center py-10">
						<MemoizedPostCard postId={post._id} />
					</div>
				))}
		</>
	);
};

export default Feed;
