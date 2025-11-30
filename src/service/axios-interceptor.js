import axios from "axios";
import { AuthAPI } from "./api";

axios.interceptors.response.use(response => response, async error => {
    if (error.response.status === 401) {
        try {
            const tokenData = await AuthAPI.refreshToken();
            const newAccessToken = tokenData.accessToken;

            error.config.headers.Authorization = `Bearer ${newAccessToken}`;
            return axios(error.config);
        }
        catch (refreshError) {
            console.error(refreshError);
            window.location.href = '/auth/login';
        }
    }
    return Promise.reject(error);
})

export default axios;