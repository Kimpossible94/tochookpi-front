import * as React from "react";
import {Button} from "@/components/ui/button";
import {UserInfo} from "@/types/user";
import {Textarea} from "@/components/ui/textarea";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Avatar, AvatarImage} from "@/components/ui/avatar";
import api from "@/services/api";
import {Command, CommandEmpty, CommandInput, CommandList} from "@/components/ui/command";
import {Pencil, X} from "lucide-react";

type MyInfoProps = {
    userInfo?: UserInfo;
};

export const MyInfo = ({ userInfo }: MyInfoProps) => {
    const [bio, setBio] = React.useState(userInfo?.bio || "");
    const [address, setAddress] = React.useState(userInfo?.address || "");
    const [searchTerm, setSearchTerm] = React.useState("");
    const [searchResults, setSearchResults] = React.useState<any[]>([]);
    const [isSearchResultsEmpty, setIsSearchREsultEmpty] = React.useState<boolean>(false);
    const [isEditingAddress, setIsEditingAddress] = React.useState(false);

    const MAX_CHAR = 500;

    const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newText = e.target.value;
        if (newText.length <= MAX_CHAR) {
            setBio(newText);
        }
    };

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            setSearchResults([]);
            setIsSearchREsultEmpty(true);
            return;
        }

        try {
            const response = await api.get(`/naver/search/local?query=${searchTerm}`);
            if(response.data.length <= 0) {
                setSearchResults([]);
                setIsSearchREsultEmpty(true);
                return;
            }

            setSearchResults(response.data);
            setIsSearchREsultEmpty(false);
        } catch (error) {
            console.error("주소 검색 실패:", error);
        }
    };

    const handleSave = async () => {
        try {
            const updatedUserInfo = {
                ...userInfo, // 기존 정보 유지
                bio,         // 변경된 값만 덮어쓰기
                address
            };

            const response = await api.put("/users", updatedUserInfo);

            if (response.status === 200) {
                alert("저장되었습니다.");
            }
        } catch (error) {
            alert("저장 중 오류가 발생했습니다.");
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
                <Label className="block text-base font-semibold mb-2">주소</Label>
                <div className="px-4 py-2 border rounded-lg shadow-sm bg-gray-50 flex justify-between">
                    <p className="text-gray-700 text-sm content-center">{address || "등록된 주소가 없습니다."}</p>
                    <Button
                        variant="outline"
                        className="text-xs h-fit p-1.5"
                        onClick={() => setIsEditingAddress(!isEditingAddress)}
                    >
                        {isEditingAddress ? <X /> : <Pencil />}
                    </Button>
                </div>
            </div>

            {isEditingAddress && (
                <div className="mt-2">
                    <Command className="rounded-lg border shadow-md md:min-w-[450px]">
                        <CommandInput
                            placeholder="새 주소 입력"
                            value={searchTerm}
                            onValueChange={(e) => setSearchTerm(e)}
                            onKeyDown={e => e.key === "Enter" && handleSearch()}
                        />
                        <CommandList>
                            {isSearchResultsEmpty && <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>}
                            {searchResults.map((item, index) => (
                                <div className="py-3 px-5 max-h-30" key={index}>
                                    <div dangerouslySetInnerHTML={{__html: item.title}} />
                                    <div className="text-sm text-gray-500 flex justify-between mt-2">
                                        <span>지번: {item.address}</span>
                                        <Button
                                            variant="outline"
                                            className="text-xs h-fit p-1"
                                            onClick={() => {
                                                setAddress(item.address);
                                                setSearchTerm("");
                                                setSearchResults([]);
                                                setIsEditingAddress(false);
                                            }}
                                        >
                                            선택
                                        </Button>
                                    </div>
                                    <div className="text-sm text-gray-500 flex justify-between mt-2">
                                        <span>도로명: {item.roadAddress}</span>
                                        <Button
                                            variant="outline"
                                            className="text-xs h-fit p-1"
                                            onClick={() => {
                                                setAddress(item.roadAddress);
                                                setSearchTerm("");
                                                setSearchResults([]);
                                                setIsEditingAddress(false);
                                            }}
                                        >
                                            선택
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </CommandList>
                    </Command>
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
                <Button onClick={handleSave}>저장</Button>
            </div>
        </div>
    );
};
