import React, { use, useEffect, useState } from "react";
import ImageButton from "./ImageButton";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import "../styles/style.css";
import "./PostCard";
import PostCard from "./PostCard";
import { addOnePost } from "../utils/postSlice";
import { useDispatch } from "react-redux";

const NewPost = ({ post_id, handlePostidChange }) => {
	const [title, setTitle] = useState("");
	const [category, setCategory] = useState("");
	const [categories, setCategories] = useState([]);
	const [description, setDescription] = useState("");
	const [selectImages, setSelectImages] = useState(false);
	const [images, setImages] = useState([]);
	const [imageIds, setImageIds] = useState([]);
	const [postId, setPostId] = useState(post_id);
	const dispatch = useDispatch();
	const categoryChanged = (value) => {
		value.length < 15 && setCategory(value);
	};

	useEffect(() => {
		setPostId(post_id);
		if (post_id === "") {
			setTitle("");
			setCategory("");
			setDescription("");
			setCategories([]);
			setImageIds([]);
		}
		console.log(postId);
	}, [post_id]);

	const addCategory = () => {
		if (category !== "") {
			categories.length < 6 &&
				!categories.find((c) => c == category) &&
				setCategories((prevCategories) => [...prevCategories, category]);
		}
		setCategory("");
	};
	const removeCategory = (cat) => {
		const newArr = categories && categories.filter((c) => c !== cat);
		setCategories(newArr);
	};

	const getUserUploadedImages = async () => {
		try {
			const res = await axios.get(BASE_URL + "/feed/get-uploaded-images", {
				withCredentials: true,
			});
			// console.log(res);
			res && setImages(res.data.data);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		try {
			getUserUploadedImages();
		} catch (err) {
			console.log(err);
		}
	}, []);

	const onImageSelect = (imageId, isSelected) => {
		// console.log(isSelected);
		if (isSelected) {
			// console.log(isSelected);
			setImageIds((imgIds) => [...imgIds, imageId]);
			// console.log(imageIds);
		} else {
			// console.log(isSelected);
			let newImageIds = imageIds.filter((i) => i !== imageId);
			setImageIds(newImageIds);
		}
		// console.log(imageIds);
	};

	useEffect(() => {
		console.log(imageIds);
	}, [imageIds]);

	const handleSubmit = async () => {
		try {
			const res = await axios.post(
				BASE_URL + "/post/save",
				{
					images: imageIds,
					title: title,
					description: description,
					category: categories,
				},
				{ withCredentials: true }
			);

			if (res.data.data) {
				const post = res.data.data;
				post.post_reactions = [];
				dispatch(addOnePost(post));
			}
			if (res.data.data._id) {
				handlePostidChange(res.data.data._id);
			}
		} catch (err) {
			console.log(err);
		}
	};

	return !postId ? (
		<>
			{!selectImages ? (
				<div className="flex justify-center py-12">
					<fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
						<legend className="fieldset-legend">Add new post</legend>
						{images.length > 0 && (
							<button
								className="btn btn-success m-1"
								onClick={() => setSelectImages(true)}
							>
								Select from uploaded images
							</button>
						)}

						<label className="label">Title</label>
						<input
							type="text"
							className="input"
							placeholder="Beautifully branched tree"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
						/>

						<label className="label">Category</label>
						<div className="join ">
							{/* <div> */}
							{/* <label className="input validator join-item"> */}
							<input
								type="text"
								className="input rounded-box"
								placeholder="nature"
								value={category}
								onChange={(e) => categoryChanged(e.target.value)}
							/>
							{/* </label> */}
							<div className="validator-hint hidden">Enter valid category</div>
							{/* </div> */}
							<button className="btn btn-success" onClick={addCategory}>
								Add
							</button>
						</div>
						{categories && (
							<div>
								{[...categories].map((c, index) => (
									<button
										key={index}
										className="btn"
										onClick={() => removeCategory(c)}
									>
										{c}
									</button>
								))}
							</div>
						)}

						<label className="label">Description</label>
						<textarea
							className="textarea"
							placeholder="The artistic nature of branching is amaizing"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						></textarea>
						<button className="btn btn-success" onClick={() => handleSubmit()}>
							Add
						</button>
					</fieldset>
				</div>
			) : (
				<>
					<button
						className="btn btn-success my-15 mx-1"
						onClick={() => setSelectImages(false)}
					>
						Select images
					</button>
					<div className="image-container">
						{images &&
							images.map((img) => (
								<div key={img._id}>
									<ImageButton
										image={img}
										handleImageButtonClick={onImageSelect}
									/>
								</div>
							))}
					</div>
				</>
			)}
		</>
	) : (
		<div className=" flex justify-center py-10">
			<PostCard postId={postId} />
		</div>
	);
};

export default NewPost;
