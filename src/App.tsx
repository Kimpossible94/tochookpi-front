import React from 'react';
import {BrowserRouter, Route, Routes, useLocation} from "react-router-dom";
import Header from "@/components/layout/Header";
import Main from "@/pages/Main";
import Footer from "@/components/layout/Footer";
import Login from "@/pages/Login";
import CreateMeeting from './pages/CreateMeeting';
import MyPage from "@/pages/MyPage";
import MeetingList from "@/pages/MeetingList";
import Signup from "@/pages/Signup";

function App() {
    return (
        <div>
            <BrowserRouter>
                <ConditionalLayout>
                    <Routes>
                        <Route path="/" element={<Main />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/create-meeting" element={<CreateMeeting />} />
                        <Route path="/my" element={<MyPage />} />
                        <Route path="/meeting-list" element={<MeetingList />} />
                        <Route path="/signup" element={<Signup />} />
                    </Routes>
                </ConditionalLayout>
            </BrowserRouter>
        </div>
    );
}

export default App;

// 특정 경로에서만 렌더링하는 레이아웃 컴포넌트
function ConditionalLayout({ children }: { children: React.ReactNode }) {
    const location = useLocation();

    // 아래에 해당하는 페이지에서는 Header와 Footer를 렌더링하지 않음
    const shouldShowLayout = ["/login", "/signup"].includes(location.pathname);

    return (
        <>
            {!shouldShowLayout && <Header />}
            <main>{children}</main>
            {!shouldShowLayout && <Footer />}
        </>
    );
}
