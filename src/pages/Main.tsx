import * as React from "react";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import HorizontalScroll from "../components/ui/HorizontalScroll";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "../components/ui/tooltip";
import {Link} from "react-router-dom";
import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog";
import {Meeting, MeetingSection} from "@/redux/types/meeting";
import MeetingDetail from "@/components/ui/meetings/MeetingDetail";
import api from "@/services/api";
import {UserSetting} from "@/redux/types/user";

const hotMeetings: Meeting[] = [
    {
        id: 1,
        title: '',
        description: '서울 방탈출',
        location: '',
        image: '',
        currentParticipantsCnt: 2,
        maxParticipantsCnt: 15,
        participants: [
            {
                username: 'string',
                email: 'string',
                profileImage: '',
                bio: '',
                address: '',
                userSetting: null,
            },
            {
                username: 'string',
                email: 'string',
                profileImage: '',
                bio: '',
                address: '',
                userSetting: null,
            },
            {
                username: 'string',
                email: 'string',
                profileImage: '',
                bio: '',
                address: '',
                userSetting: null,
            },
            {
                username: 'string',
                email: 'string',
                profileImage: '',
                bio: '',
                address: '',
                userSetting: null,
            },
            {
                username: 'string',
                email: 'string',
                profileImage: '',
                bio: '',
                address: '',
                userSetting: null,
            },
            {
                username: 'string',
                email: 'string',
                profileImage: '',
                bio: '',
                address: '',
                userSetting: null,
            },
            {
                username: 'string',
                email: 'string',
                profileImage: '',
                bio: '',
                address: '',
                userSetting: null,
            },
            {
                username: 'string',
                email: 'string',
                profileImage: '',
                bio: '',
                address: '',
                userSetting: null,
            },
            {
                username: 'string',
                email: 'string',
                profileImage: '',
                bio: '',
                address: '',
                userSetting: null,
            },
            {
                username: 'string',
                email: 'string',
                profileImage: '',
                bio: '',
                address: '',
                userSetting: null,
            },
        ],
        period: { startDate: '', endDate: '' },
        schedules: [],
        status: 'BEFORE',
        review: [],
    },
    {
        id: 2,
        title: '',
        description: '서울 방탈출',
        location: '',
        image: '',
        currentParticipantsCnt: 2,
        maxParticipantsCnt: 15,
        participants: [],
        period: { startDate: '', endDate: '' },
        schedules: [],
        status: 'BEFORE',
        review: [],
    },
];

const recentMeetings: Meeting[] = [
    {
        id: 2,
        title: '',
        description: '서울 방탈출',
        location: '',
        image: '',
        currentParticipantsCnt: 2,
        maxParticipantsCnt: 15,
        participants: [],
        period: { startDate: '', endDate: '' },
        schedules: [],
        status: 'BEFORE',
        review: [],
    },
    {
        id: 2,
        title: '',
        description: '서울 방탈출',
        location: '',
        image: '',
        currentParticipantsCnt: 2,
        maxParticipantsCnt: 15,
        participants: [],
        period: { startDate: '', endDate: '' },
        schedules: [],
        status: 'BEFORE',
        review: [],
    },
    {
        id: 2,
        title: '',
        description: '서울 방탈출',
        location: '',
        image: '',
        currentParticipantsCnt: 2,
        maxParticipantsCnt: 15,
        participants: [],
        period: { startDate: '', endDate: '' },
        schedules: [],
        status: 'BEFORE',
        review: [],
    },
    {
        id: 2,
        title: '',
        description: '서울 방탈출',
        location: '',
        image: '',
        currentParticipantsCnt: 2,
        maxParticipantsCnt: 15,
        participants: [],
        period: { startDate: '', endDate: '' },
        schedules: [],
        status: 'BEFORE',
        review: [],
    },
];

const gameMeetings: Meeting[] = [
    {
        id: 2,
        title: '',
        description: '서울 방탈출',
        location: '',
        image: '',
        currentParticipantsCnt: 2,
        maxParticipantsCnt: 15,
        participants: [],
        period: { startDate: '', endDate: '' },
        schedules: [],
        status: 'BEFORE',
        review: [],
    },
];

const artExhibitionMeetings: Meeting[] = [
    {
        id: 2,
        title: '',
        description: '서울 방탈출',
        location: '',
        image: '',
        currentParticipantsCnt: 2,
        maxParticipantsCnt: 15,
        participants: [],
        period: { startDate: '', endDate: '' },
        schedules: [],
        status: 'BEFORE',
        review: [],
    },
];

const meetings: MeetingSection[] = [
    {
        subject: 'Hot',
        subjectName: '지금 핫한 모임',
        children: hotMeetings
    },
    {
        subject: 'recent',
        subjectName: '최근 등록된 모임',
        children: recentMeetings
    },
    {
        subject: 'game',
        subjectName: '게임 모임',
        children: gameMeetings
    },
    {
        subject: 'artExhibition',
        subjectName: '전시회 모임',
        children: artExhibitionMeetings
    },
]

const Main = () => {
    const handleJoinMeeting = async (meetingId: number) => {
        try {
            await api.post("meetings/join",
                {id: meetingId},)
            .then(e => {})
        } catch (error) {}
    }

    return (
        <div className="p-6 space-y-10 pt-20">
            <section className="text-center my-20">
                {/*모임 한눈에 보기 말고 배너로 토축피 모여라 이미지 넣으면 더 좋을듯..?*/}
                <h1 className="text-5xl font-extrabold">모임 한눈에 보기</h1>
                <Link to="/create-meeting">
                    <button
                        className="mt-10 py-3 px-5 text-xl text-white bg-black rounded-3xl hover:opacity-80 focus:outline-none"
                        onClick={() => console.log("모임 만들기 버튼 클릭됨")}
                    >
                        모임 만들기
                    </button>
                </Link>
            </section>

            {meetings.map((subject, idx) => (
                <section key={subject.subject}>
                    <h2 className="text-xl font-bold mb-4">{subject.subjectName}</h2>
                    <HorizontalScroll>
                        {subject.children.map((meeting, idx) => (
                            <Card
                                key={meeting.id}
                                className="min-w-[150px] md:min-w-[250px] lg:min-w-[350px] mr-10 flex flex-col justify-between">
                                <CardHeader>
                                    <CardTitle>{meeting.title}</CardTitle>
                                    <CardDescription>{meeting.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <div className="grid w-full items-center gap-2">
                                        {/* 참가자 카운트 */}
                                        <div className="flex flex-col space-y-1.5">
                                            <div className="flex space-x-1.5">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                                     fill="currentColor" className="size-6">
                                                    <path fillRule="evenodd"
                                                          d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                                                          clipRule="evenodd"/>
                                                </svg>
                                                <strong>{meeting.currentParticipantsCnt} / {meeting.maxParticipantsCnt}</strong>
                                            </div>
                                        </div>

                                        {/* 참가자 리스트 */}
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {meeting.participants.slice(0, 5).map((user, idx) => (
                                                <TooltipProvider key={idx} delayDuration={0}>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Avatar>
                                                                <AvatarImage src="https://github.com/shadcn.png"/>
                                                            </Avatar>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>{user.username}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            ))}

                                            {meeting.participants.length > 5 && (
                                                <Avatar>
                                                    <AvatarFallback>+{meeting.participants.length - 5}</AvatarFallback>
                                                </Avatar>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline">자세히</Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-full max-h-full sm:max-w-[80%] sm:max-h-[80%] w-full h-full">
                                            <MeetingDetail meetingId={meeting.id} />
                                        </DialogContent>
                                    </Dialog>
                                    <Button
                                        className="bg-red-400 hover:bg-red-400 hover:opacity-80"
                                        onClick={() => handleJoinMeeting(meeting.id)}
                                    >
                                        모임 참가
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </HorizontalScroll>
                </section>
            ))}
        </div>
    );
};

export default Main;