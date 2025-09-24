// src/App.js

import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Body from "./components/Body";
import Feed from "./components/Feed";
import Login from "./components/Login";
// import Connections from "./components/Connections";
// import Requests from "./components/Requests";
import Settings from "./components/Settings";
import NewImage from "./components/NewImage";
import NewPost from "./components/NewPost";
import Categories from "./components/Categories";
import CategoryFeed from "./components/CategoryFeed";
import AllRequests from "./components/AllRequests";
import Chat from "./components/Chat";
import Profile from "./components/Profile";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { reduxStore, persistor } from "./utils/reduxStore";
import ChatList from "./components/ChatList";

function App() {
	// State to track if the device is considered a desktop.
	// We'll use a screen width of 1100px as the breakpoint.
	const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1100);

	useEffect(() => {
		const handleResize = () => {
			// Update the state based on the current window width
			setIsDesktop(window.innerWidth >= 1100);
		};

		// Add a listener for the window resize event
		window.addEventListener("resize", handleResize);

		// Clean up the event listener when the component unmounts
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []); // The empty dependency array ensures this effect runs only once on mount

	return (
		<React.StrictMode>
			<Provider store={reduxStore}>
				<PersistGate loading={null} persistor={persistor}>
					<BrowserRouter>
						{isDesktop ? (
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
										<Route
											path="/category-feed/:category"
											element={<CategoryFeed />}
										/>
										<Route path="/all-chats" element={<ChatList />} />
										<Route
											path="/chat/:targetUserId/:targetUserName"
											element={<Chat />}
										/>
										<Route path="/profile" element={<Profile />} />
									</Route>
								</Routes>
								{/* </BrowserRouter> */}
							</div>
						) : (
							// Render the pc_or_laptop-only message
							<div className="text-center p-6 bg-primary text-white rounded-2xl shadow-lg border-2 border-primary-content-600">
								<p className="text-lg sm:text-xl font-bold">
									Currently only available from a PC or a Laptop.
								</p>
								<p className="text-sm mt-2">
									Please switch to a desktop device to view the app.
								</p>
							</div>
						)}
					</BrowserRouter>
				</PersistGate>
			</Provider>
		</React.StrictMode>
	);
}

export default App;
