import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
    const isAuthenticated = !!localStorage.getItem("accessToken"); // 토큰으로 인증 체크

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
