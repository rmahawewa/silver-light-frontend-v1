import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { reduxStore, persistor } from "./utils/reduxStore";
import { PersistGate } from "redux-persist/integration/react";
import Body from "./components/Body";
import Drawer from "./components/Sidebar";
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

function App() {
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
	// Here is where you should put the beforeunload event listener
	useEffect(() => {
		const handleBeforeUnload = async () => {
			try {
				handleLogout();
			} catch (error) {
				console.error("Logout failed on tab close:", error);
			}
		};

		window.addEventListener("beforeunload", handleBeforeUnload);

		// This is the cleanup function that runs when the component unmounts
		return () => {
			window.removeEventListener("beforeunload", handleBeforeUnload);
		};
	}, []); // The empty dependency array ensures this runs once

	return (
		<div className="text-info-content/90">
			<Provider store={reduxStore}>
				<PersistGate loading={null} persistor={persistor}>
					<BrowserRouter basename="/">
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
								<Route
									path="/category-feed/:category"
									element={<CategoryFeed />}
								/>
								<Route
									path="/chat/:targetUserId/:targetUserName"
									element={<Chat />}
								/>
								<Route path="/profile" element={<Profile />} />
							</Route>
						</Routes>
					</BrowserRouter>
				</PersistGate>
			</Provider>
		</div>
	);
}

export default App;
