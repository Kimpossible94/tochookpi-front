import React, { useEffect, useState } from "react";
import { Meeting } from "@/types/meeting";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";

interface MeetingDetailProps {
    meetingId: string;
}

const MeetingDetail: React.FC<MeetingDetailProps> = ({ meetingId }) => {
    const [meeting, setMeeting] = useState<Meeting | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchMeetingDetails = async () => {
            setLoading(true);
            try {
                // const response = await fetch(`/api/meetings/${meetingId}`);
                // const data = await response.json();
                // setMeeting(data);

                setMeeting({
                    id: "1", // 고유한 id 추가
                    image: "/path/to/hot-meeting1.jpg",
                    title: "서울 방탈출",
                    description: "강남에서 방탈출할 사람~",
                    currentParticipantsCnt: 2,
                    maxParticipantsCnt: 15,
                    participants: ["강광일", "김영범"]
                });
            } catch (error) {
                console.error("모임 데이터를 불러오는 중 오류 발생:", error);
            } finally {
                setLoading(false); // 데이터가 로드되면 로딩 상태 종료
            }
        };

        fetchMeetingDetails(); // 데이터 요청 함수 호출
    }, [meetingId]); // meetingId가 변경될 때마다 호출

    if (loading) {
        return (
            <div className="p-6 flex justify-center items-center h-full">
                {/* 로딩 중일 때 Spinner 표시 */}
                <Spinner size="large" show={true}>
                    데이터를 불러오는 중...
                </Spinner>
            </div>
        );
    }

    if (!meeting) {
        return <p className="p-6">모임 정보를 불러올 수 없습니다.</p>;
    }

    return (
        <div className="relative p-6">
            <h2 className="text-2xl font-bold">{meeting.title}</h2>
            <p className="mt-2 text-lg">{meeting.description}</p>

            <div className="mt-6">
                <h3 className="text-xl font-semibold">참가자 정보</h3>
                <div className="flex flex-wrap gap-2 mt-4">
                    {meeting.participants.map((name, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                            <Avatar>
                                <AvatarImage src="https://github.com/shadcn.png" />
                            </Avatar>
                            <span>{name}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-6">
                <h3 className="text-xl font-semibold">참가 현황</h3>
                <p className="mt-2 text-lg">
                    {meeting.currentParticipantsCnt} / {meeting.maxParticipantsCnt} 명
                </p>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-300">
                <button className="w-full py-2 bg-red-400 text-white hover:bg-red-500">
                    모임 참가
                </button>
            </div>
        </div>
    );
};

export default MeetingDetail;
