import * as React from "react";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Avatar, AvatarImage} from "@/components/ui/avatar";
import api from "@/services/api";
import {Command, CommandEmpty, CommandInput, CommandList} from "@/components/ui/command";
import {Pencil, Save} from "lucide-react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/redux/store";
import {setUserInfo} from "@/redux/reducers/userSlice";

export const MyInfo = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.user);

    const [bio, setBio] = React.useState(user?.bio || "");
    const [address, setAddress] = React.useState(user?.address || "");
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
                ...user,
                bio,
                address
            };

            const response = await api.put("/users", updatedUserInfo);

            if (response.status === 200 && user) {
                dispatch(setUserInfo({
                    ...user,
                    bio: bio,
                    address: address,
                }));
                alert("저장되었습니다.");
            }
        } catch (error) {
            alert("저장 중 오류가 발생했습니다.");
        }
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (file) {
            const formData = new FormData();
            formData.append("file", file);

            try {
                const response = await api.put("/users/profile", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

                if (response.status === 200 && user) {
                    dispatch(setUserInfo({
                        ...user,
                        profileImage: response.data
                    }));
                }
            } catch (error) {
                console.error("이미지 업로드 실패:", error);
            }
        }
    };

    return (
        <div className="flex flex-col space-y-6">
            <div className="flex items-center space-x-4">
                <Avatar className="w-20 h-20">
                    <AvatarImage src={user?.profileImage || "https://github.com/shadcn.png"}/>
                </Avatar>
                <Input
                    type="file"
                    accept="image/png, image/jpeg"
                    className="hidden"
                    id="profileImageUpload"
                    onChange={handleFileChange}
                />
                <Label className="p-3 border border-gray-400 rounded-md"
                       htmlFor="profileImageUpload">
                    새로운 사진 업로드
                </Label>
                <Button className="bg-red-500 hover:bg-red-700" variant="destructive">
                    삭제
                </Button>
            </div>

            <div>
                <Label className="block text-base font-semibold mb-2">이름</Label>
                <Input type="text" className="w-full border rounded-md p-2" value={user?.username} readOnly/>
            </div>

            <div>
                <Label className="block text-base font-semibold mb-2">주소</Label>
                <div className="px-4 py-2 border rounded-lg shadow-sm bg-gray-50 flex justify-between text-gray-700">
                    {isEditingAddress ? (
                        <Input
                            className="w-full border-none shadow-none text-sm p-0 mr-3"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="주소를 입력하세요."
                        />
                    ) : (
                        <p className="text-sm content-center">{address || "등록된 주소가 없습니다."}</p>
                    )}                    <Button
                        variant="outline"
                        className="text-xs h-fit p-1.5"
                        onClick={() => setIsEditingAddress(!isEditingAddress)}
                    >
                        {isEditingAddress ? <Save /> : <Pencil />}
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
