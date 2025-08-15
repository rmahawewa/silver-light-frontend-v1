import React, { use, useEffect, useState } from "react";

const ImageButton = ({ image, handleImageButtonClick }) => {
	const [isClicked, setIsClicked] = useState(false);
	const imageButtonClick = () => {
		setIsClicked((value) => (value = !value));
	};
	useEffect(() => {
		// console.log(isClicked);
		handleImageButtonClick(image._id, isClicked);
	}, [isClicked]);
	return (
		<div>
			<button
				style={{
					border: isClicked ? "5px solid gray" : "5px solid white",
					width: "25em",
					height: "20em",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
				onClick={() => imageButtonClick()}
			>
				<img
					style={{
						maxWidth: "100%",
						maxHeight: "100%",
						objectFit: "contain",
					}}
					src={image.url}
					alt={image.photoTitle}
				/>
			</button>
		</div>
	);
};

export default ImageButton;
