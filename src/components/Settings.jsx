import React, { useState } from "react";
import ChangePassword from "./ChangePassword";

const Settings = () => {
	const [changeOption, setChangeOption] = useState({
		password: true,
		optionTwo: false,
		optionThree: false,
	});
	const onChangeOption = (option, value) => {};
	return (
		<>
			<h3 className=" m-4 font-semibold">Settings</h3>
			<div className="flex-column justify-center">
				<div>
					<details className="collapse bg-base-100 border-base-300 border">
						<summary className="collapse-title text-sm font-semibold">
							Change Password
						</summary>
						<div className="collapse-content text-sm">
							<ChangePassword />
						</div>
					</details>
				</div>
				{/* <div>
				<details className="collapse bg-base-100 border-base-300 border">
					<summary className="collapse-title font-semibold">
						Change Password
					</summary>
					<div className="collapse-content text-sm">
						<ChangePassword />
					</div>
				</details>
			</div> */}
			</div>
		</>
	);
};

export default Settings;
