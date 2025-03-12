import api from "@/services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {useDispatch} from "react-redux";
import {clearUser} from "@/redux/reducers/userSlice";

export const DeleteAccount = () => {
    const confirmationText = "상기 사항을 확인했으며 회원탈퇴에 동의합니다.";
    const [deleteDisable, setDeleteDisable] = useState<boolean>(true);
    const dispatch = useDispatch();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setDeleteDisable(value !== confirmationText);
    };

    const handleDelete = async () => {
        try {
            const response = await api.delete("/users");
            if (response.status === 200) {
                alert("회원탈퇴가 완료되었습니다.");
                dispatch(clearUser());
                localStorage.removeItem("accessToken");
                document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                window.location.href = "/";
            }
        } catch (error) {
            alert("회원탈퇴 중 오류가 발생했습니다.");
        }
    };

    return (
        <Card className="space-y-6 bg-red-100">
            <CardHeader className="pb-1">
                <CardTitle className="text-red-600 text-xl">회원탈퇴</CardTitle>
                <CardDescription className="text-red-600">
                    회원 탈퇴를 진행하기 전에 아래 사항을 확인해주세요.
                </CardDescription>
            </CardHeader>

            <CardContent className="grid gap-4">
                <div className="items-center rounded-md shadow p-4 bg-white">
                    <div className="text-sm grid gap-2">
                        <p className="text-xl font-bold">안내사항</p>
                        <p>❗ 프로필 정보(이름, 이메일, 프로필 사진 등)는 삭제됩니다.</p>
                        <p>❗ 생성한 모임은 삭제되지 않고, 권한만 해당 모임의 다른 참여자에게 위임됩니다.</p>
                        <p>❗ 탈퇴로 인해서 삭제되는 정보는 복구가 불가능합니다.</p>
                    </div>

                    <div className="text-sm mt-10">
                        <p>
                            회원 탈퇴에 동의하시면 아래에 <b>"{confirmationText}"</b> 라고 입력 후 탈퇴 버튼을 눌러주세요.
                        </p>
                    </div>

                    <div className="flex justify-between mt-2">
                        <Input
                            type="text"
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md"
                            placeholder={confirmationText}
                        />
                        <Button
                            variant="destructive"
                            className="bg-red-600 ml-3"
                            disabled={deleteDisable}
                            onClick={handleDelete}
                        >
                            회원탈퇴
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
