// src/utils/axiosInstance.js

import axios from "axios";
import { reduxStore } from "./reduxStore";
import { logout } from "./authSlice";

const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_BASE_URL,
	withCredentials: true,
});

// Request interceptor to add the access token to the header
axiosInstance.interceptors.request.use(
	(config) => {
		const state = reduxStore.getState();
		const accessToken = state.auth.accessToken; // Assuming you store the token in Redux
		if (accessToken) {
			config.headers.Authorization = `Bearer ${accessToken}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		// Check for 401 error and make sure it's not a retry to prevent an infinite loop
		if (error.response.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;
			try {
				// Call the refresh token endpoint
				const res = await axiosInstance.post("/refresh-token", {});
				const newAccessToken = res.data.accessToken;

				// Update the Redux store and the original request header with the new token
				reduxStore.dispatch(updateAccessToken(newAccessToken));
				originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

				// Retry the original request
				return axiosInstance(originalRequest);
			} catch (refreshError) {
				// If the refresh token also fails, the session is over.
				// Redirect to login and clear all state.
				reduxStore.dispatch(logout());
				window.location.href = "/login";
				return Promise.reject(refreshError);
			}
		}
		return Promise.reject(error);
	}
);

export default axiosInstance;
