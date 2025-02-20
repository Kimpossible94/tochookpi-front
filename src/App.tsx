import React from 'react';
import {BrowserRouter, useLocation} from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AppRoutes from "@/routes/AppRoutes";

function App() {
    return (
        <div>
            <BrowserRouter>
                <ConditionalLayout>
                    <AppRoutes />
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
