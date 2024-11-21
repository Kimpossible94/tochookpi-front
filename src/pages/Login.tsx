import React from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";

const Login = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                <div className="items-center flex flex-col">
                    <h1 className="text-2xl font-bold text-center mb-6">로그인</h1>
                </div>

                {/* 이메일 */}
                <div className="mb-4">
                    <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        이메일
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="이메일을 입력하세요"
                        className="mt-1 block w-full"
                    />
                </div>

                {/* 비밀번호 */}
                <div className="mb-6">
                    <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        비밀번호
                    </Label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="비밀번호를 입력하세요"
                        className="mt-1 block w-full"
                    />
                </div>

                <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
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
                    <div className="flex gap-4 mt-4 justify-center">
                        <Button variant="outline" className="w-full">
                            Google 로그인
                        </Button>
                        <Button variant="outline" className="w-full">
                            Facebook 로그인
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
