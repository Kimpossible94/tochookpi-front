import {useEffect, useState} from "react";
import {Navigate, Outlet, useLocation} from "react-router-dom";
import axios from "axios";

const PrivateRoute = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const location = useLocation();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const accessToken = localStorage.getItem("accessToken");
                if (!accessToken) {
                    setIsAuthenticated(false);
                    return;
                }

                await axios.get("/auth/validate-token", {
                    headers: { Authorization: `${accessToken}` },
                });

                setIsAuthenticated(true);
            } catch (error: any) {
                const errorCode = error.response?.data?.code;

                if (['AUTH-001', 'AUTH-002', 'AUTH-003', 'AUTH-004'].includes(errorCode)) {
                    try {
                        const refreshResponse = await axios.post("auth/refresh", {}, { withCredentials: true });
                        const newAccessToken = refreshResponse.headers.authorization;
                        localStorage.setItem('accessToken', newAccessToken);
                        setIsAuthenticated(true);
                    } catch (refreshError) {
                        localStorage.removeItem("accessToken");
                        setIsAuthenticated(false);
                    }
                }
            }
        };

        checkAuth();
    }, []);

    if (isAuthenticated === null) return <div>Loading...</div>;

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />;
};

export default PrivateRoute;
