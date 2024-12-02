import React, {useState} from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Textarea} from "@/components/ui/textarea";
import {Switch} from "@/components/ui/switch";
import MapBox from "@/components/ui/MapBox";
import {DateTimePicker24h} from "@/components/ui/DateTimePicker24h";

const CreateMeeting = () => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        location: "",
        date: "",
        fee: 0,
        maxParticipants: 0,
        category: "",
        rules: "",
        approvalRequired: false,
    });
    const [searchKeyword, setSearchKeyword] = useState(""); // 검색 키워드
    const [searchResults, setSearchResults] = useState<any[]>([]); // 검색 결과
    const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; name: string } | null>(null); // 선택된 장소
    const [showMap, setShowMap] = useState(false); // 지도 표시 상태

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();

        // 더미 검색 결과 생성
        const dummyResults = [
            { name: "서울역", lat: 37.554722, lng: 126.970833, address: "서울특별시 용산구 한강대로 405" },
            { name: "강남역", lat: 37.497942, lng: 127.027621, address: "서울특별시 강남구 강남대로 396" },
            { name: "이태원", lat: 37.534488, lng: 126.993232, address: "서울특별시 용산구 이태원로 177" },
        ];

        const filteredResults = dummyResults.filter((result) =>
            result.name.includes(searchKeyword)
        );

        setSearchResults(filteredResults);
    };

    const handleResultClick = (location: { lat: number; lng: number; name: string }) => {
        setSelectedLocation(location); // 선택된 장소 저장
        setSearchResults([]); // 검색 결과 목록 숨기기
        setSearchKeyword(location.name); // 선택된 장소로 검색어 업데이트
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSwitchChange = (value: boolean) => {
        setFormData((prev) => ({ ...prev, approvalRequired: value }));
    };

    const toggleMap = () => {
        setShowMap((prev) => !prev); // 지도 표시 상태 토글
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("모임 데이터:", formData);
        // API 요청 또는 폼 데이터 처리 로직 추가
    };

    return (
        <div className="min-h-screen flex items-center justify-center pt-20">
            <form
                className="w-full max-w-3xl p-8"
                onSubmit={handleSubmit}
            >
                <p className="text-2xl font-bold mb-6">모임 만들기</p>

                {/* 모임 제목 */}
                <div className="mb-4">
                    <Label htmlFor="title" className="block text-sm font-bold text-gray-700">
                        모임 제목<span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="title"
                        name="title"
                        type="text"
                        placeholder="모임 제목을 입력하세요"
                        required
                        value={formData.title}
                        onChange={handleChange}
                    />
                </div>

                {/* 모임 설명 */}
                <div className="mb-4">
                    <Label htmlFor="description" className="block text-sm font-bold text-gray-700">
                        모임 설명
                    </Label>
                    <Textarea
                        id="description"
                        name="description"
                        placeholder="모임에 대한 간단한 설명을 입력하세요"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>

                {/* 모임 장소 */}
                <div className="mb-4 relative">
                    <Label htmlFor="location" className="block text-sm font-bold text-gray-700">
                        모임 장소
                    </Label>
                    <div className="flex items-center">
                        <Input
                            id="location"
                            name="location"
                            type="text"
                            placeholder="장소를 검색해주세요."
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault(); // 기본 폼 제출 방지
                                    handleSearch(e);
                                }
                            }}
                        />
                        <button
                            type="button"
                            onClick={toggleMap} // 지도 표시 상태 토글
                            className="ml-2 p-2 rounded-full hover:bg-gray-300"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
                            </svg>
                        </button>
                    </div>
                    {searchResults.length > 0 && (
                        <ul
                            className="absolute bg-white shadow-lg border rounded-md w-full mt-2 max-h-48 overflow-auto z-10"
                        >
                            {searchResults.map((result, index) => (
                                <li
                                    key={index}
                                    onClick={() => handleResultClick(result)}
                                    className="p-2 hover:bg-gray-100 cursor-pointer"
                                >
                                    <p className="font-semibold">{result.name}</p>
                                    <p className="text-sm text-gray-500">{result.address}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* 지도 표시 */}
                {showMap && <MapBox location={selectedLocation} />}

                {/* 모임 일자 */}
                <div className="mb-4">
                    <Label htmlFor="date" className="block text-sm font-bold text-gray-700">
                        모임 일자
                    </Label>
                    <DateTimePicker24h
                        value={formData.date ? new Date(formData.date) : undefined}
                        onChange={(date) =>
                            setFormData((prev) => ({
                                ...prev,
                                date: date.toISOString(),
                            }))
                        }
                    />
                </div>

                {/* 회비 */}
                <div className="mb-4">
                    <Label htmlFor="fee" className="block text-sm font-bold text-gray-700">
                        회비<span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="fee"
                        name="fee"
                        type="number"
                        placeholder="0"
                        required
                        value={formData.fee}
                        onChange={handleChange}
                    />
                </div>

                {/* 최대 참가 인원 */}
                <div className="mb-4">
                    <Label
                        htmlFor="maxParticipants"
                        className="block text-sm font-bold text-gray-700"
                    >
                        최대 참가 인원<span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="maxParticipants"
                        name="maxParticipants"
                        type="number"
                        placeholder="최대 참가 인원을 입력하세요"
                        required
                        value={formData.maxParticipants}
                        onChange={handleChange}
                    />
                </div>

                {/* 모임 카테고리 */}
                <div className="mb-4">
                    <Label className="block text-sm font-bold text-gray-700">
                        모임 카테고리<span className="text-red-500">*</span>
                    </Label>
                    <Select onValueChange={(value) => setFormData({ ...formData, category: value })}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="카테고리를 선택하세요" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="sports">스포츠</SelectItem>
                            <SelectItem value="music">음악</SelectItem>
                            <SelectItem value="technology">기술</SelectItem>
                            <SelectItem value="art">예술</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* 모임 규칙 */}
                <div className="mb-4">
                    <Label htmlFor="rules" className="block text-sm font-bold text-gray-700">
                        모임 규칙
                    </Label>
                    <Textarea
                        id="rules"
                        name="rules"
                        placeholder="모임 규칙을 간단히 작성하세요"
                        value={formData.rules}
                        onChange={handleChange}
                    />
                </div>

                {/* 참가 승인 여부 */}
                <div className="mb-6 flex items-center">
                    <Label
                        htmlFor="approvalRequired"
                        className="text-sm font-bold text-gray-700 mr-4"
                    >
                        참가 승인 여부<span className="text-red-500">*</span>
                    </Label>
                    <Switch
                        id="approvalRequired"
                        name="approvalRequired"
                        checked={formData.approvalRequired}
                        onCheckedChange={handleSwitchChange}
                    />
                </div>

                <Button type="submit" className="w-full bg-black text-white py-4 rounded-lg">
                    모임 만들기
                </Button>
            </form>
        </div>
    );
};

export default CreateMeeting;
