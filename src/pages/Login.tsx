import React, {useState} from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import kakaoLoginBtn from "@/assets/kakao_login_medium_narrow.png";
import naverLoginBtn from "@/assets/naver_login.png";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    // 로그인 요청 함수
    const handleLogin = async () => {
        if(!email || !password) {
            alert("이메일과 패스워드를 입력해주세요.");
            return;
        }

        try {
            const formData = new URLSearchParams();
            formData.append("email", email);
            formData.append("password", password);

            await axios.post("/login", formData, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }).then(e => {
                localStorage.setItem('accessToken', e.headers.authorization);
                navigate("/");
            })
        } catch (error) {
            alert("로그인 중 문제가 발생했습니다.");
        }
    }

    return (
        <div className="min-h-screen flex">
            {/* 이미지 섹션 */}
            <div className="hidden md:flex w-1/3">
                <img
                    src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExejJiN3Y0dWU3cDNvaGxrZ2d3a2d6OG1mdDBmcjhwZWR3dHd4eWQ3NSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/zINs6k7lwfawSbLOIc/giphy.webp"
                    alt="side-image"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* 로그인 섹션 */}
            <div className="w-full md:w-2/3 flex items-center justify-center bg-white">
                <div className="w-full max-w-md p-8">
                    <div className="flex flex-col justify-start">
                        <p className="bg-black text-white py-1 px-2 w-fit text-right">토축피 <br/>모임</p>
                        <p className="text-2xl font-bold text-left my-6">로그인</p>
                    </div>

                    {/* 이메일 */}
                    <div className="mb-4">
                        <Label htmlFor="email" className="block text-sm font-bold text-gray-700">
                            이메일
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={e => {setEmail(e.target.value)}}
                            className="mt-1 py-6 block w-full"
                        />
                    </div>

                    {/* 비밀번호 */}
                    <div className="mb-6">
                        <Label htmlFor="password" className="block text-sm font-bold text-gray-700">
                            비밀번호
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={e => {setPassword(e.target.value)}}
                            className="mt-1 py-6 block w-full"
                        />
                    </div>

                    <Button
                        onClick={handleLogin}
                        className="w-full bg-black py-6 rounded-3xl hover:opacity-70 text-white"
                    >
                        로그인
                    </Button>

                    <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
                        <a href="/forgot-password" className="hover:underline">
                            비밀번호를 잊으셨나요?
                        </a>
                        <a href="/signup" className="hover:underline">
                            회원가입
                        </a>
                    </div>

                    {/* 소셜 로그인 */}
                    <div className="mt-6">
                        <p className="text-center text-sm text-gray-600">또는</p>
                        <div className="flex gap-4 mt-4 justify-between">
                            <img
                                src={kakaoLoginBtn}
                                alt="kakao-login"
                                className="w-1/2 h-auto aspect-[4/1]" // 비율 유지
                            />
                            <img
                                src={naverLoginBtn}
                                alt="naver-login"
                                className="w-1/2 h-auto aspect-[4/1]" // 비율 유지
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
