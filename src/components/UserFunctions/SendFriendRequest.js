import axios from "axios";
import { BASE_URL } from "../../utils/constants";
import { addNewConnectionRequest } from "../../utils/connectionRequestSlice";

const SendFriendRequest = async (dispatch, receiverId) => {
	try {
		const res = await axios.post(
			BASE_URL + "/request/send",
			{ toUserId: receiverId },
			{ withCredentials: true }
		);
		console.log(res);
		const flattenedConnections = res.data.data;
		console.log(flattenedConnections);
		dispatch(addNewConnectionRequest(flattenedConnections));
	} catch (err) {
		console.error(err);
	}
};

export default SendFriendRequest;
