import * as React from "react";
import {Link} from "react-router-dom";
import {Meeting, MeetingSection} from "@/redux/types/meeting";
import mainImage from "../assets/main.png";
// import mainImage from "../assets/main2.jpeg";

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
    return (
        <div className="space-y-10 pt-20">
            <section className="flex items-center justify-between my-20 px-10">
                {/* 왼쪽 컨텐츠 */}

                <div className="max-w-xl">
                    <h1 className="text-6xl font-extrabold leading-tight mb-6">
                        토축피 모임 페이지에 <br /> 오신 걸 환영합니다.
                    </h1>
                    <p className="text-lg opacity-80 mb-8">
                        다양한 모임을 만들고 친구들과 함께하세요!
                    </p>
                    <Link to="/create-meeting">
                        <button
                            className="py-3 px-6 text-xl text-white bg-black rounded-3xl hover:opacity-80 focus:outline-none"
                        >
                            모임 만들러 가기
                        </button>
                    </Link>
                </div>

                {/* 오른쪽 이미지 */}
                <div className="w-1/2 flex justify-end">
                    <img
                        src={mainImage}
                        alt="배너 이미지"
                        className="max-w-full max-h-[500px] h-auto object-cover rounded-2xl"
                    />
                </div>
            </section>
        </div>
    );
};

export default Main;