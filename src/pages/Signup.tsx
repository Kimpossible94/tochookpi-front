"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {AlertCircle, Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axios from "axios"

// Zod validation schema
const FormSchema = z.object({
    name: z.string().min(2, "이름은 최소 2자 이상이어야 합니다."),
    phone: z.string().min(10, "휴대폰 번호는 최소 10자리여야 합니다."),
    email: z.string().email("이메일 형식이 올바르지 않습니다."),
    password: z
        .string()
        .min(8, "비밀번호는 8자리 이상이어야 합니다.")
        .regex(/[a-zA-Z]/, "비밀번호는 영문자를 포함해야 합니다.")
        .regex(/[!@#$%^&*]/, "비밀번호는 특수문자를 포함해야 합니다."),
    confirmPassword: z.string().min(8, "비밀번호 확인은 8자 이상이어야 합니다."),
}).refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
})

export default function SignupPage() {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
            phone: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    })

    const { handleSubmit, control, formState: { errors } } = form

    const onSubmit = async (data: any) => {
        try {
            const response = await axios.post("/signup", data)
        } catch (error) {
            setError("회원가입 중 문제가 발생했습니다.")
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

            {/* 회원가입 섹션 */}
            <div className="w-full md:w-2/3 flex items-center justify-center bg-white">
                <div className="w-full max-w-md p-8">
                    <div className="flex flex-col justify-start">
                        <p className="text-2xl font-bold text-left my-6">회원가입</p>
                    </div>

                    {/* 이름 */}
                    <div className="mb-4">
                        <Label htmlFor="name" className="block text-sm font-bold text-gray-700">
                            이름
                        </Label>
                        <Input
                            {...form.register("name")}
                            id="name"
                            className="mt-1 py-6 block w-full"
                        />
                        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                    </div>

                    {/* 휴대폰 번호 */}
                    <div className="mb-4">
                        <Label htmlFor="phone" className="block text-sm font-bold text-gray-700">
                            휴대폰 번호
                        </Label>
                        <Input
                            {...form.register("phone")}
                            id="phone"
                            type="tel"
                            className="mt-1 py-6 block w-full"
                        />
                        {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
                    </div>

                    {/* 이메일 */}
                    <div className="mb-4">
                        <Label htmlFor="email" className="block text-sm font-bold text-gray-700">
                            이메일
                        </Label>
                        <Input
                            {...form.register("email")}
                            id="email"
                            type="email"
                            className="mt-1 py-6 block w-full"
                        />
                        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                    </div>

                    {/* 비밀번호 */}
                    <div className="mb-4 relative">
                        <Label htmlFor="password" className="block text-sm font-bold text-gray-700">
                            비밀번호
                        </Label>
                        <div className="flex items-center relative">
                            <Input
                                {...form.register("password")}
                                id="password"
                                type={showPassword ? "text" : "password"}
                                className="mt-1 py-6 block w-full"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5 text-gray-500" />
                                ) : (
                                    <Eye className="h-5 w-5 text-gray-500" />
                                )}
                            </button>
                        </div>
                        {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                    </div>

                    {/* 비밀번호 확인 */}
                    <div className="mb-4 relative">
                        <Label htmlFor="confirm-password" className="block text-sm font-bold text-gray-700">
                            비밀번호 확인
                        </Label>
                        <div className="flex items-center relative">
                            <Input
                                {...form.register("confirmPassword")}
                                id="confirm-password"
                                type={showConfirmPassword ? "text" : "password"}
                                className="mt-1 py-6 block w-full"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-5 w-5 text-gray-500" />
                                ) : (
                                    <Eye className="h-5 w-5 text-gray-500" />
                                )}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    <Button
                        onClick={handleSubmit(onSubmit)}
                        className="w-full bg-black py-6 rounded-3xl hover:opacity-70 text-white"
                    >
                        회원가입
                    </Button>

                    <div className="flex justify-center items-center mt-4 text-sm text-gray-600">
                        <a href="/login" className="hover:underline">
                            이미 계정이 있으신가요? 로그인
                        </a>
                    </div>

                    {/* 에러 메시지 */}
                    {error && (
                        <div className="flex items-center justify-center">
                            <Alert
                                variant="destructive"
                                className="fixed bottom-10 w-fit bg-white"
                                onClick={() => setError(null)}
                            >
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
