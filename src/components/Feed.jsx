import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ImageCard from "./ImageCard";
import PostCard from "./PostCard";
import { GetFeed, GetConnections } from "./UserFunctions/GetFeed";

const Feed = () => {
	const dispatch = useDispatch();
	const feedData = useSelector((store) => store.imagefeed);
	const postData = useSelector((store) => store.postfeed);
	const category = "";
	console.log(feedData);
	console.log(postData);

	useEffect(() => {
		GetFeed(dispatch, category);
		GetConnections(dispatch);
	}, []);

	if (!feedData) return;
	if (feedData.length === 0)
		return <h1 className="flex justify-center my-10">Feed is empty</h1>;

	return (
		<>
			{feedData != {} &&
				feedData &&
				feedData.map((img) => (
					<div key={img._id} className=" flex justify-center py-10">
						<ImageCard key={img._id} imageId={img._id} />
					</div>
				))}
			{postData &&
				postData.map((post) => (
					<div key={post._id} className="flex justify-center py-10">
						<PostCard key={post._id} postId={post._id} />
					</div>
				))}
		</>
	);
};

export default Feed;
