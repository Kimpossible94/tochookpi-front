import * as React from "react";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import HorizontalScroll from "../ui/HorizontalScroll";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

const hotMeetings = [
    {
        image: "/path/to/hot-meeting1.jpg",
        title: "서울 방탈출",
        description: "강남에서 방탈출할 사람~",
        currentParticipantsCnt: 2,
        maxParticipantsCnt: 15,
        participants: ["강광일", "김영범"]
    },
    {
        image: "/path/to/hot-meeting2.jpg",
        title: "방어회 먹자",
        description: "가락시장역, 너만오면 고",
        currentParticipantsCnt: 6,
        maxParticipantsCnt: 25,
        participants: ["강광일", "김영범", "방원", "엄윤호", "이헌", "김재훈"]
    },
];

const recentMeetings = [
    {
        image: "/path/to/recent-meeting1.jpg",
        title: "칼바람 전사 모집",
        description: "전사의 심장이 울린다 둥둥둥..",
        currentParticipantsCnt: 1,
        maxParticipantsCnt: 10,
        participants: ["김영범"]
    },
    {
        image: "/path/to/recent-meeting2.jpg",
        title: "전시회",
        description: "고흐 전시회 갈사람..?",
        currentParticipantsCnt: 2,
        maxParticipantsCnt: 8,
        participants: ["강광일", "방원"]
    },
    {
        image: "/path/to/hot-meeting1.jpg",
        title: "서울 방탈출",
        description: "강남에서 방탈출할 사람~",
        currentParticipantsCnt: 2,
        maxParticipantsCnt: 15,
        participants: ["강광일", "김영범"]
    },
    {
        image: "/path/to/hot-meeting2.jpg",
        title: "방어회 먹자",
        description: "가락시장역, 너만오면 고",
        currentParticipantsCnt: 6,
        maxParticipantsCnt: 25,
        participants: ["강광일", "김영범", "방원", "엄윤호", "이헌", "김재훈", "김재훈", "김재훈", "김재훈"]
    },
];

const gameMeetings = [
    {
        image: "/path/to/recent-meeting1.jpg",
        title: "칼바람 전사 모집",
        description: "전사의 심장이 울린다 둥둥둥..",
        currentParticipantsCnt: 1,
        maxParticipantsCnt: 10,
        participants: ["김영범"]
    },
];

const artExhibitionMeetings = [
    {
        image: "/path/to/recent-meeting2.jpg",
        title: "전시회",
        description: "고흐 전시회 갈사람..?",
        currentParticipantsCnt: 2,
        maxParticipantsCnt: 8,
        participants: ["강광일", "방원"]
    },
];

const Main = () => {
    return (
        <div className="p-6 space-y-10 pt-20">
            <section className="text-center my-20">
                <h1 className="text-5xl font-extrabold">모임 한눈에 보기</h1>
            </section>

            <section>
                <h2 className="text-xl font-bold mb-4">지금 핫한 모임</h2>
                <HorizontalScroll>
                    {hotMeetings.map((meeting, index) => (
                        <Card className="min-w-[150px] md:min-w-[250px] lg:min-w-[350px] mr-10">
                            <CardHeader>
                                <CardTitle>{meeting.title}</CardTitle>
                                <CardDescription>{meeting.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid w-full items-center gap-2">
                                    {/* 참가자 카운트 */}
                                    <div className="flex flex-col space-y-1.5">
                                        <div className="flex space-x-1.5">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                                 fill="currentColor" className="size-6">
                                                <path fill-rule="evenodd"
                                                      d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                                                      clip-rule="evenodd"/>
                                            </svg>
                                            <strong>{meeting.currentParticipantsCnt} / {meeting.maxParticipantsCnt}</strong>
                                        </div>
                                    </div>

                                    {/* 참가자 리스트 */}
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {meeting.participants.map((name, idx) => (
                                            <Avatar>
                                                <AvatarImage src="https://github.com/shadcn.png" />
                                                <AvatarFallback>CN</AvatarFallback>
                                            </Avatar>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <Button variant="outline">자세히</Button>
                                <Button className="bg-red-400">모임 참가</Button>
                            </CardFooter>
                        </Card>
                    ))}
                </HorizontalScroll>
            </section>

            <section>
                <h2 className="text-xl font-bold mb-4">최근 등록된 모임</h2>
                <HorizontalScroll>
                    {recentMeetings.map((meeting, index) => (
                        <Card className="min-w-[150px] md:min-w-[250px] lg:min-w-[350px] mr-10 flex flex-col justify-between">
                            <CardHeader>
                                <CardTitle>{meeting.title}</CardTitle>
                                <CardDescription>{meeting.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid w-full items-center gap-2">
                                    {/* 참가자 카운트 */}
                                    <div className="flex flex-col space-y-1.5">
                                        <div className="flex space-x-1.5">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                                 fill="currentColor" className="size-6">
                                                <path fill-rule="evenodd"
                                                      d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                                                      clip-rule="evenodd"/>
                                            </svg>
                                            <strong>{meeting.currentParticipantsCnt} / {meeting.maxParticipantsCnt}</strong>
                                        </div>
                                    </div>

                                    {/* 참가자 리스트 */}
                                    <div className="flex flex-wrap gap-2 mt-2">
                                            {meeting.participants.map((name, idx) => (
                                                <Avatar>
                                                    <AvatarImage src="https://github.com/shadcn.png" />
                                                    <AvatarFallback>CN</AvatarFallback>
                                                </Avatar>
                                            ))}
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <Button variant="outline">자세히</Button>
                                <Button className="bg-red-400">모임 참가</Button>
                            </CardFooter>
                        </Card>
                    ))}
                </HorizontalScroll>
            </section>

            <section>
                <h2 className="text-xl font-bold mb-4">게임 모임</h2>
                <HorizontalScroll>
                    {gameMeetings.map((meeting, index) => (
                        <Card className="w-[350px]">
                            <CardHeader>
                                <CardTitle>{meeting.title}</CardTitle>
                                <CardDescription>{meeting.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid w-full items-center gap-2">
                                    {/* 참가자 카운트 */}
                                    <div className="flex flex-col space-y-1.5">
                                        <div className="flex space-x-1.5">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                                 fill="currentColor" className="size-6">
                                                <path fill-rule="evenodd"
                                                      d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                                                      clip-rule="evenodd"/>
                                            </svg>
                                            <strong>{meeting.currentParticipantsCnt} / {meeting.maxParticipantsCnt}</strong>
                                        </div>
                                    </div>

                                    {/* 참가자 리스트 */}
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {meeting.participants.map((name, idx) => (
                                            <Avatar>
                                                <AvatarImage src="https://github.com/shadcn.png" />
                                                <AvatarFallback>CN</AvatarFallback>
                                            </Avatar>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <Button variant="outline">자세히</Button>
                                <Button className="bg-red-400">모임 참가</Button>
                            </CardFooter>
                        </Card>
                    ))}
                </HorizontalScroll>
            </section>

            <section>
                <h2 className="text-xl font-bold mb-4">전시회 모임</h2>
                <HorizontalScroll>
                    {artExhibitionMeetings.map((meeting, index) => (
                        <Card className="w-[350px]">
                            <CardHeader>
                                <CardTitle>{meeting.title}</CardTitle>
                                <CardDescription>{meeting.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid w-full items-center gap-2">
                                    {/* 참가자 카운트 */}
                                    <div className="flex flex-col space-y-1.5">
                                        <div className="flex space-x-1.5">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                                 fill="currentColor" className="size-6">
                                                <path fill-rule="evenodd"
                                                      d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                                                      clip-rule="evenodd"/>
                                            </svg>
                                            <strong>{meeting.currentParticipantsCnt} / {meeting.maxParticipantsCnt}</strong>
                                        </div>
                                    </div>

                                    {/* 참가자 리스트 */}
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {meeting.participants.map((name, idx) => (
                                            <Avatar>
                                                <AvatarImage src="https://github.com/shadcn.png" />
                                                <AvatarFallback>CN</AvatarFallback>
                                            </Avatar>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <Button variant="outline">자세히</Button>
                                <Button className="bg-red-400">모임 참가</Button>
                            </CardFooter>
                        </Card>
                    ))}
                </HorizontalScroll>
            </section>
        </div>
    );
};

export default Main;