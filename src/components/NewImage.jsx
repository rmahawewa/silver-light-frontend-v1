import React, { useEffect, useState, useRef } from "react";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import ImageCard from "./ImageCard";
import { addoneimage } from "../utils/imageSlice";
import { useDispatch } from "react-redux";
// import filterImage from "../utils/imageFilter";

const NewImage = ({ imageId, handleImageIdChange }) => {
	const [selectedFile, setSelectedFile] = useState(null);
	const [message, setMessage] = useState("");
	const [imageUrl, setImageUrl] = useState("");
	const [title, setTitle] = useState("");
	const [category, setCategory] = useState("");
	const [categories, setCategories] = useState([]);
	const [description, setDescription] = useState("");

	const fileInputRef = useRef(null);

	const [isImageValid, setIsImageValid] = useState(true);
	const dispatch = useDispatch();
	const categoryChanged = (value) => {
		value.length < 21 && setCategory(value);
	};

	const makeFieldsEmpty = () => {
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
			setSelectedFile(null);

			setMessage("");
			setTitle("");
			setCategories([]);
			setDescription("");
		}
	};

	useEffect(() => {
		console.log(imageId.imageId);
	}, []);

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

	const handleFileChange = (event) => {
		try {
			setIsImageValid(true);
			setSelectedFile(event.target.files[0]);
			setMessage("");
			setImageUrl("");
		} catch (err) {
			console.error(err);
		}
	};

	const handleSubmit = async () => {
		try {
			if (!selectedFile) {
				setMessage("Please select upload an image");
				return;
			}
			console.log("submit clicked");

			const formData = new FormData();
			formData.append("image", selectedFile);
			formData.append("photoTitle", title);
			formData.append("category", categories);
			formData.append("photoDescription", description);

			const response = await axios.post(BASE_URL + "/image/upload", formData, {
				headers: { "Content-Type": "multipart/form-data" },
				withCredentials: true,
			});
			if (response.data.data) {
				const img = response.data.data;
				img.reactions = [];
				dispatch(addoneimage(img));
			}
			if (response.data.data._id) {
				console.log(response.data.data._id);
				handleImageIdChange(response.data.data._id);
			}
			if (imageId) console.log("123456");
			makeFieldsEmpty();
		} catch (err) {
			console.error(err);
			setMessage(err);
		}
	};

	return !imageId ? (
		<div className="flex justify-center py-12">
			<fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
				{/* <legend className="fieldset-legend">Add new image</legend> */}
				<legend className="fieldset-legend text-2xl font-bold px-2">
					Add new image
				</legend>
				<label className="label">Image</label>
				<input
					type="file"
					accept="image/*"
					className="input"
					onChange={handleFileChange}
					ref={fileInputRef}
				/>
				{message && <span>{message}</span>}
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
				<button
					className="btn btn-success"
					onClick={handleSubmit}
					disabled={
						!(
							selectedFile &&
							title.length > 0 &&
							categories.length > 0 &&
							description.length > 0
						)
					}
				>
					Add
				</button>
			</fieldset>
		</div>
	) : (
		<div className=" flex justify-center py-10">
			<ImageCard imageId={imageId} />
		</div>
	);
};

export default NewImage;
