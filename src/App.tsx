import React from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "@/pages/Home";
import Header from "@/components/layout/Header";

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