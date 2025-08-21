import axios from "axios";
import { BASE_URL } from "../../utils/constants";

const saveVisitedUserInformation = async () => {
	try {
		const siteUrl = window.location.href;
		const res = await axios.post(
			BASE_URL + "/lastvisited/save",
			{ siteUrl: siteUrl },
			{ withCredentials: true }
		);
		console.log(res);
	} catch (err) {
		console.error(err);
	}
};

export default saveVisitedUserInformation;
