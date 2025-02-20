import axios from "axios";
const instance = axios.create();

// 요청 인터셉터
instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if(token != null) {
        config.headers["Authorization"] = token;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// 응답 인터셉터
instance.interceptors.response.use((response) => {
    return response;
}, async (error) => {
    const originalRequest = error.config;
    if ((error.response.status === 401 || error.response.status === 400) && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
            const refreshResponse = await axios.post("auth/refresh", {}, { withCredentials: true });
            const newAccessToken = refreshResponse.headers.authorization;
            localStorage.setItem('accessToken', newAccessToken);

            // 실패했던 요청 다시 시도
            originalRequest.headers["Authorization"] = newAccessToken;
            return instance(originalRequest);
        } catch (refreshError) {
            localStorage.removeItem("accessToken");
            window.location.href = "/login"; // 로그인 페이지 경로
            return Promise.reject(refreshError);
        }
    }
    return Promise.reject(error);
});
export default instance;