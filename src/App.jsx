// src/App.js

import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Body from "./components/Body";
import Feed from "./components/Feed";
import Login from "./components/Login";
import Connections from "./components/Connections";
import Requests from "./components/Requests";
import Settings from "./components/Settings";
import NewImage from "./components/NewImage";
import NewPost from "./components/NewPost";
import Categories from "./components/Categories";
import CategoryFeed from "./components/CategoryFeed";
import AllRequests from "./components/AllRequests";
import Chat from "./components/Chat";
import Profile from "./components/Profile";
import { useDispatch } from "react-redux";
import { login } from "./utils/authSlice";
import axios from "axios";
import { removeUser } from "./utils/userSlice";
import { removeConnections } from "./utils/connectionRequestSlice";
import { removePosts } from "./utils/postSlice";
import { removeImage } from "./utils/imageSlice";
import { useNavigate } from "react-router-dom";

// Assuming you have BASE_URL and navigate defined elsewhere or pass them as props
const BASE_URL = import.meta.env.VITE_BASE_URL;

function App() {
	// These hooks now correctly access the Redux store
	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		const fetchCurrentUser = async () => {
			try {
				const res = await axios.get(`${BASE_URL}/current-user`, {
					withCredentials: true,
				});
				if (res.data.user) {
					dispatch(login(res.data.user));
				}
			} catch (err) {
				// Handle error
			}
		};
		fetchCurrentUser();
	}, [dispatch]);

	const handleLogout = async () => {
		try {
			await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
			dispatch(removeUser());
			dispatch(removeConnections());
			dispatch(removePosts());
			dispatch(removeImage());
			return navigate("/login");
		} catch (err) {
			console.error(err.message);
		}
	};

	useEffect(() => {
		const handleBeforeUnload = async () => {
			try {
				// Call handleLogout directly
				await handleLogout();
			} catch (error) {
				console.error("Logout failed on tab close:", error);
			}
		};
		window.addEventListener("beforeunload", handleBeforeUnload);
		return () => {
			window.removeEventListener("beforeunload", handleBeforeUnload);
		};
	}, []);

	return (
		<div className="text-info-content/90">
			{/* <BrowserRouter basename="/"> */}
			<Routes>
				<Route path="/" element={<Body />}>
					<Route path="/" element={<Feed />} />
					<Route path="/login" element={<Login />} />
					<Route path="/connections" element={<AllRequests />} />
					<Route path="/conn-requests" element={<AllRequests />} />
					<Route path="/settings" element={<Settings />} />
					<Route path="/new-image" element={<NewImage />} />
					<Route path="/new-post" element={<NewPost />} />
					<Route path="/categories" element={<Categories />} />
					<Route path="/category-feed/:category" element={<CategoryFeed />} />
					<Route
						path="/chat/:targetUserId/:targetUserName"
						element={<Chat />}
					/>
					<Route path="/profile" element={<Profile />} />
				</Route>
			</Routes>
			{/* </BrowserRouter> */}
		</div>
	);
}

export default App;
