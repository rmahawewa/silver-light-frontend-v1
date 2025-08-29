import userReducer from "./userSlice";
import imagefeedReducer from "./imageSlice";
import postfeedReducer from "./postSlice";
import connectionfeedReducer from "./connectionRequestSlice";
import authReducer from "./authSlice";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
	persistStore,
	persistReducer,
	FLUSH,
	REHYDRATE,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

const rootReducer = combineReducers({
	user: userReducer,
	imagefeed: imagefeedReducer,
	connectionfeed: connectionfeedReducer,
	postfeed: postfeedReducer,
	auth: authReducer,
	// ...other reducers
});

const persistConfig = {
	key: "root", // key for the storage
	version: 1,
	storage, // which storage to use (localStorage, sessionStorage, etc.)
	whitelist: ["user", "imagefeed", "connectionfeed", "postfeed", "auth"], // only 'user' reducer will be persisted
	// blacklist: ['someOtherReducer'], // exclude some reducers from being persisted
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const reduxStore = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
			},
		}),
});

export const persistor = persistStore(reduxStore);
