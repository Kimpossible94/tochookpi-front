import * as React from "react";
import {Button} from "@/components/ui/button";
import {UserInfo} from "@/types/user";
import {Textarea} from "@/components/ui/textarea";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Avatar, AvatarImage} from "@/components/ui/avatar";
import api from "@/services/api";

type MyInfoProps = {
    userInfo?: UserInfo;
};

export const MyInfo = ({ userInfo }: MyInfoProps) => {
    const [bio, setBio] = React.useState(userInfo?.bio || "");
    const [address, setAddress] = React.useState(userInfo?.address || "");
    const [searchTerm, setSearchTerm] = React.useState("");
    const [searchResults, setSearchResults] = React.useState<string[]>([]);
    const MAX_CHAR = 500;

    const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newText = e.target.value;
        if (newText.length <= MAX_CHAR) {
            setBio(newText);
        }
    };

    const handleSearch = async () => {
        if (!searchTerm.trim()) return;

        try {
            const response = await api.get(`/naver/search/local?query=${searchTerm}`);
            setSearchResults(response.data);
        } catch (error) {
            console.error("주소 검색 실패:", error);
        }
    };

    return (
        <div className="flex flex-col space-y-6">
            <div className="flex items-center space-x-4">
                <Avatar className="w-20 h-20">
                    <AvatarImage src={userInfo?.profileImage || "https://github.com/shadcn.png"}/>
                </Avatar>
                <Button variant="outline">새로운 사진 업로드</Button>
                <Button className="bg-red-500 hover:bg-red-700" variant="destructive">삭제</Button>
            </div>

            <div>
                <Label className="block text-base font-semibold mb-2">이름</Label>
                <Input type="text" className="w-full border rounded-md p-2" value={userInfo?.username} readOnly/>
            </div>

            <div>
                <Label className="block text-base font-semibold mb-2">주소 변경</Label>
                <div className="flex space-x-2">
                    <Input
                        type="text"
                        className="w-full border rounded-md p-2"
                        placeholder="새 주소 입력"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <Button onClick={handleSearch}>검색</Button>
                </div>
            </div>

            <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
                <Label className="block text-base font-semibold mb-2">현재 주소</Label>
                <p className="text-gray-700">{address || "등록된 주소가 없습니다."}</p>
            </div>

            {searchResults.length > 0 && (
                <div className="border rounded-lg p-3 mt-3 bg-white shadow">
                    <Label className="block text-base font-semibold mb-2">검색 결과</Label>
                    <ul className="space-y-2">
                        {searchResults.map((addr, index) => (
                            <li
                                key={index}
                                className="p-2 hover:bg-gray-100 cursor-pointer border-b"
                                onClick={() => {
                                    setAddress(addr);
                                    setSearchResults([]);
                                }}
                            >
                                {addr}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div>
                <div className="flex justify-between">
                    <Label className="block text-base font-semibold mb-2">자기소개</Label>
                    <div className="text-xs text-gray-500 self-center text-right">
                        {bio.length} / {MAX_CHAR}
                    </div>
                </div>
                <Textarea
                    className="w-full border rounded-md p-2"
                    rows={10}
                    placeholder="나에 대해서 설명해주세요."
                    value={bio}
                    onChange={handleBioChange}
                />
            </div>

            <div className="flex justify-end mt-4">
                <Button>저장</Button>
            </div>
        </div>
    );
};
