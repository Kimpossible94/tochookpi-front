import React from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Header from "@/components/layout/Header";
import Home from "@/pages/Home";

function App() {
    return (
        <div>
            <BrowserRouter>
                <Header />
                <Routes>
                    <Route path="/" element={<Home />}>`</Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;