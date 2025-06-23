import React, {useEffect, useState} from "react";
import {Meeting} from "@/redux/types/meeting";
import {Avatar, AvatarImage} from "@/components/ui/avatar";
import {Spinner} from "@/components/ui/spinner";
import api from "@/services/api";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

interface MeetingDetailProps {
    meetingId: number;
}

const MeetingDetail: React.FC<MeetingDetailProps> = ({ meetingId }) => {
    const [meeting, setMeeting] = useState<Meeting | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchMeetingDetails();
    }, []);

    const fetchMeetingDetails = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/meetings/${meetingId}`);
            setMeeting(response.data);
        } catch (error) {
            console.error("모임 데이터를 불러오는 중 오류 발생:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-6 flex justify-center items-center h-full">
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
        <div className="grid grid-cols-1 lg:grid-cols-4 grid-rows-1 lg:grid-rows-4 gap-3">
            <Card className="col-span-1 lg:col-span-1 lg:row-span-2">
                <CardHeader>
                    <CardTitle>
                        참가자
                    </CardTitle>
                </CardHeader>
                <CardContent>

                </CardContent>
            </Card>
            <Card className="col-span-1 lg:col-span-3 lg:row-span-1">
                <CardHeader>
                    <CardTitle>
                        타이틀
                    </CardTitle>
                </CardHeader>
                <CardContent>

                </CardContent>
            </Card>
            <Card className="col-span-1 lg:col-span-3 lg:row-span-3">
                <CardHeader>
                    <CardTitle>
                        상세내용
                    </CardTitle>
                </CardHeader>
                <CardContent>

                </CardContent>
            </Card>
            <Card className="col-span-1 lg:col-span-1 lg:row-span-2">
                <CardHeader>
                    <CardTitle>
                        지도
                    </CardTitle>
                </CardHeader>
                <CardContent>

                </CardContent>
            </Card>
        </div>
    );
};

export default MeetingDetail;
