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
		const res = await axios.post(
			BASE_URL + "/feed",
			{ categ: category },
			{
				withCredentials: true,
			}
		);
		console.log(res.data);
		// console.log(res.data.postData);
		dispatch(addImageFeed(res.data.imageData));
		dispatch(addPostFeed(res.data.postData));
		// const postComments = await axios.get(BASE_URL + "/feed/postcomments", {
		// 	// operate later
		// 	withCredentials: true,
		// });
	} catch (err) {
		console.error(err);
	}
};

export const GetConnections = async (dispatch) => {
	try {
		const res = await axios.get(BASE_URL + "/request/user-requests", {
			withCredentials: true,
		});
		console.log(res.data.connections);
		dispatch(addConnectionFeed(res.data.connections));
	} catch (err) {}
};
