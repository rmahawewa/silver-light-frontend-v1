import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ImageCard from "./ImageCard";
import PostCard from "./PostCard";
import { GetFeed, GetConnections } from "./UserFunctions/GetFeed";
import { useParams } from "react-router-dom";

const CategoryFeed = () => {
	const dispatch = useDispatch();
	const feedData = useSelector((store) => store.imagefeed);
	const postData = useSelector((store) => store.postfeed);
	const { category } = useParams();
	console.log(feedData);
	console.log(postData);
	useEffect(() => {
		console.log("test12345");
		GetFeed(dispatch, category);
		GetConnections(dispatch);
	}, [category]);

	if (!feedData) return;
	if (feedData.length === 0)
		return <h1 className="flex justify-center my-10">Feed is empty</h1>;

	return (
		<>
			{feedData &&
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

export default CategoryFeed;
