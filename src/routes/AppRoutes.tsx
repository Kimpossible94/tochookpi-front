import {Route, Routes} from "react-router-dom";
import PrivateRoute from "@/components/common/PrivateRoute";
import Main from "@/pages/Main";
import Login from "@/pages/auth/Login";
import Signup from "@/pages/auth/Signup";
import MyPage from "@/pages/user/MyPage";
import CreateMeeting from "@/pages/meeting/CreateMeeting";
import MeetingList from "@/pages/meeting/MeetingList";
import MyMeeting from "@/pages/meeting/MyMeeting";
import PublicRoute from "@/components/common/PublicRoute";
import React from "react";

const AppRoutes = () => (
    <Routes>
        <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
        </Route>

        <Route element={<PrivateRoute />}>
            <Route path="/" element={<Main />} />
            <Route path="/my" element={<MyPage />} />
            <Route path="/create-meeting" element={<CreateMeeting />} />
            <Route path="/meeting-list" element={<MeetingList />} />
            <Route path="/my-meeting" element={<MyMeeting />} />
        </Route>
    </Routes>
);

export default AppRoutes;