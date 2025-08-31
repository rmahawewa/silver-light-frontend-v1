// src/App.js

import React, { useEffect } from "react";
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

function App() {
	return (
		<React.StrictMode>
			<Provider store={reduxStore}>
				<PersistGate loading={null} persistor={persistor}>
					<BrowserRouter>
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
									<Route
										path="/chat/:targetUserId/:targetUserName"
										element={<Chat />}
									/>
									<Route path="/profile" element={<Profile />} />
								</Route>
							</Routes>
							{/* </BrowserRouter> */}
						</div>
					</BrowserRouter>
				</PersistGate>
			</Provider>
		</React.StrictMode>
	);
}

export default App;
