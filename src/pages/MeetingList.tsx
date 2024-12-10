import React from "react";
import { Meeting } from "@/types/meeting";

// 더미 데이터
const dummyMeetings: Meeting[] = [
    {
        id: "1",
        image: "/path/to/hot-meeting1.jpg",
        title: "서울 방탈출",
        description: "강남에서 방탈출할 사람~",
        currentParticipantsCnt: 2,
        maxParticipantsCnt: 15,
        participants: ["강광일", "김영범"],
    },
    {
        id: "2",
        image: "/path/to/hot-meeting2.jpg",
        title: "방어회 먹자",
        description: "가락시장역, 너만오면 고",
        currentParticipantsCnt: 6,
        maxParticipantsCnt: 25,
        participants: ["강광일", "김영범", "방원", "엄윤호", "이헌", "김재훈"],
    },
    {
        id: "3",
        image: "/path/to/recent-meeting1.jpg",
        title: "칼바람 전사 모집",
        description: "전사의 심장이 울린다 둥둥둥..",
        currentParticipantsCnt: 1,
        maxParticipantsCnt: 10,
        participants: ["김영범"],
    },
];

const categories = [
    "게임",
    "음식",
    "전시회",
    "운동",
    "여행",
    "스터디",
];

const MeetingListPage: React.FC = () => {
    return (
        <div className="flex flex-col lg:flex-row p-6 gap-4">
            {/* 모임 목록 영역 (좌측) */}
            <div className="lg:w-3/5">
                <h2 className="text-2xl font-bold mb-4">모임 목록</h2>
                <div className="flex flex-col gap-4">
                    {dummyMeetings.map((meeting) => (
                        <div
                            key={meeting.id}
                            className="flex items-center bg-white shadow-md rounded-md overflow-hidden"
                        >
                            {/* 이미지 */}
                            <img
                                src={meeting.image}
                                alt={meeting.title}
                                className="w-32 h-32 object-cover"
                            />
                            {/* 텍스트 정보 */}
                            <div className="p-4 flex-1">
                                <h3 className="text-xl font-semibold">
                                    {meeting.title}
                                </h3>
                                <p className="text-gray-600 mt-1">
                                    {meeting.description}
                                </p>
                                <p className="text-sm text-gray-500 mt-2">
                                    {meeting.currentParticipantsCnt} /{" "}
                                    {meeting.maxParticipantsCnt} 명 참여 중
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 카테고리 영역 (우측) */}
            <div className="lg:w-2/5 bg-gray-100 shadow-md rounded-md p-4">
                <h2 className="text-xl font-bold mb-4">카테고리 선택</h2>
                <div className="flex flex-wrap gap-2">
                    {categories.map((category, idx) => (
                        <button
                            key={idx}
                            className="py-2 px-4 bg-white border rounded-md shadow-sm hover:bg-gray-200"
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MeetingListPage;
