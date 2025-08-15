import React, { useState } from "react";
import axios from "axios"; // Or use built-in fetch

function App() {
	const [selectedFile, setSelectedFile] = useState(null);
	const [message, setMessage] = useState("");
	const [imageUrl, setImageUrl] = useState("");

	const handleFileChange = (event) => {
		setSelectedFile(event.target.files[0]); // Get the first file
		setMessage(""); // Clear previous messages
		setImageUrl(""); // Clear previous image
	};

	const handleUpload = async () => {
		if (!selectedFile) {
			setMessage("Please select a file first!");
			return;
		}

		const formData = new FormData();
		formData.append("image", selectedFile); // 'image' is the field name expected by the backend
		formData.append("photoTitle", "Beautiful nature");
		formData.append("category", ["Snow", "White", "Cool"]);
		formData.append(
			"photoDescription",
			"Aloe vera grows in a way that empasize golden ratio. This beautiful pattern is a miracle in the nature."
		);

		try {
			setMessage("Uploading...");
			const response = await axios.post(
				"http://localhost:1111/image/upload",
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data", // Important for file uploads
					},
				}
			);
			setMessage("Upload successful!");
			setImageUrl(response.data.imageUrl); // Assuming backend sends back the image URL
			setSelectedFile(null); // Clear selected file after successful upload
		} catch (error) {
			console.error("Error uploading image:", error);
			setMessage(
				"Upload failed: " + (error.response?.data?.message || error.message)
			);
			setImageUrl("");
		}
	};

	return (
		<div>
			<h2>Upload Image</h2>
			<input type="file" accept="image/*" onChange={handleFileChange} />
			<button onClick={handleUpload} disabled={!selectedFile}>
				Upload
			</button>
			{message && <p>{message}</p>}
			{imageUrl && (
				<div>
					<h3>Uploaded Image:</h3>
					<img
						src={imageUrl}
						alt="Uploaded"
						style={{ maxWidth: "300px", maxHeight: "300px" }}
					/>
					<p>
						URL:{" "}
						<a href={imageUrl} target="_blank" rel="noopener noreferrer">
							{imageUrl}
						</a>
					</p>
				</div>
			)}
		</div>
	);
}

export default App;
