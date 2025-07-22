import {Route, Routes} from "react-router-dom";
import PrivateRoute from "@/components/common/PrivateRoute";
import Main from "@/pages/Main";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import MyPage from "@/pages/MyPage";
import CreateMeeting from "@/pages/CreateMeeting";
import MeetingList from "@/pages/MeetingList";
import React from "react";
import PublicRoute from "@/components/common/PublicRoute";
import MyMeeting from "@/pages/MyMeeting";

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