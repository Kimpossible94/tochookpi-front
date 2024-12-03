import React from "react";

interface MyMeetingsProps {
    subMenu: string;
}

const MyMeetings = ({ subMenu }: MyMeetingsProps) => {
    const myCreatedMeetings = [
        { id: 1, name: "React 공부 모임", date: "2024-12-10" },
        { id: 2, name: "Node.js 세미나", date: "2024-12-12" },
    ];

    const myJoinedMeetings = [
        { id: 3, name: "Vue.js 개발자 모임", date: "2024-12-15" },
        { id: 4, name: "자바스크립트 워크샵", date: "2024-12-20" },
    ];

    const renderMeetings = () => {
        const meetings = subMenu === "내가만든모임" ? myCreatedMeetings : myJoinedMeetings;

        return meetings.length > 0 ? (
            <ul>
                {meetings.map((meeting) => (
                    <li key={meeting.id} className="p-2 border-b">
                        <div className="font-semibold">{meeting.name}</div>
                        <div className="text-sm text-gray-600">{meeting.date}</div>
                    </li>
                ))}
            </ul>
        ) : (
            <div>참여한 모임이 없습니다.</div>
        );
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">{subMenu === "내가만든모임" ? "내가 만든 모임" : "내가 참여한 모임"}</h2>
            {renderMeetings()}
        </div>
    );
};

export default MyMeetings;
