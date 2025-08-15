import axios from "axios";
import { BASE_URL } from "../../utils/constants";
import { addNewConnectionRequest } from "../../utils/connectionRequestSlice";

const SendFriendRequest = async (dispatch, receiverId) => {
	try {
		const responce = await axios.post(
			BASE_URL + "/request/send",
			{ toUserId: receiverId },
			{ withCredentials: true }
		);
		console.log(responce);
		dispatch(addNewConnectionRequest(responce.data.data));
	} catch (err) {
		console.error(err);
	}
};

export default SendFriendRequest;
