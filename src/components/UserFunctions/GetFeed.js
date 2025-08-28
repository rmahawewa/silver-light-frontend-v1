import { useDispatch } from "react-redux";
import axios from "axios";
import { addFeed } from "../../utils/feedSlice";
import { addImageFeed } from "../../utils/imageSlice";
import { addPostFeed } from "../../utils/postSlice";
import { addConnectionFeed } from "../../utils/connectionRequestSlice";
import { BASE_URL } from "../../utils/constants";

export const GetFeed = async (dispatch, category) => {
	// if (feedData) return; // this output null
	console.log(category);
	try {
		// const res = await axios.post(
		// 	BASE_URL + "/feed",
		// 	{ categ: category },
		// 	{
		// 		withCredentials: true,
		// 	}
		// );
		// console.log(res.data);
		// const res = await axios.get(BASE_URL + "/feed/" + category, {
		// 	withCredentials: true,
		// });
		const res = await axios.get(BASE_URL + "/feed", {
			params: {
				category: category,
			},
			withCredentials: true,
		});
		dispatch(addImageFeed(res?.data?.imageData));
		dispatch(addPostFeed(res?.data?.postData));
	} catch (err) {
		console.error(err);
	}
};

export const GetConnections = async (dispatch) => {
	try {
		const res = await axios.get(BASE_URL + "/request/user-requests", {
			withCredentials: true,
		});
		// Create a new, flattened array from the API response
		const flattenedConnections = res.data.connections.flatMap((item) =>
			Array.isArray(item) ? item : [item]
		);
		console.log(flattenedConnections); // Verify the new structure
		dispatch(addConnectionFeed(flattenedConnections));
	} catch (err) {
		console.error(err);
	}
};
