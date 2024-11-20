import * as React from "react";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import HorizontalScroll from "../ui/HorizontalScroll";

const hotMeetings = [
    {
        image: "/path/to/hot-meeting1.jpg",
        title: "서울 방탈출",
        description: "강남에서 방탈출할 사람~",
        participants: 15,
    },
    {
        image: "/path/to/hot-meeting2.jpg",
        title: "방어회 먹자",
        description: "가락시장역, 너만오면 고",
        participants: 25,
    },
];

const recentMeetings = [
    {
        image: "/path/to/recent-meeting1.jpg",
        title: "칼바람 전사 모집",
        description: "전사의 심장이 울린다 둥둥둥..",
        participants: 10,
    },
    {
        image: "/path/to/recent-meeting2.jpg",
        title: "전시회",
        description: "고흐 전시회 갈사람..?",
        participants: 8,
    },
    {
        image: "/path/to/hot-meeting1.jpg",
        title: "서울 방탈출",
        description: "강남에서 방탈출할 사람~",
        participants: 15,
    },
    {
        image: "/path/to/hot-meeting2.jpg",
        title: "방어회 먹자",
        description: "가락시장역, 너만오면 고",
        participants: 25,
    },
];

const gameMeetings = [
    {
        image: "/path/to/recent-meeting1.jpg",
        title: "칼바람 전사 모집",
        description: "전사의 심장이 울린다 둥둥둥..",
        participants: 10,
    },
];

const artExhibitionMeetings = [
    {
        image: "/path/to/recent-meeting2.jpg",
        title: "전시회",
        description: "고흐 전시회 갈사람..?",
        participants: 8,
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
                                <div className="grid w-full items-center gap-4">
                                    <div className="flex flex-col space-y-1.5">
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <Button variant="outline">Cancel</Button>
                                <Button>Deploy</Button>
                            </CardFooter>
                        </Card>
                    ))}
                </HorizontalScroll>
            </section>

            <section>
                <h2 className="text-xl font-bold mb-4">최근 등록된 모임</h2>
                <HorizontalScroll>
                    {recentMeetings.map((meeting, index) => (
                        <Card className="min-w-[150px] md:min-w-[250px] lg:min-w-[350px] mr-10">
                            <CardHeader>
                                <CardTitle>{meeting.title}</CardTitle>
                                <CardDescription>{meeting.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid w-full items-center gap-4">
                                    <div className="flex flex-col space-y-1.5">
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <Button variant="outline">Cancel</Button>
                                <Button>Deploy</Button>
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
                                <div className="grid w-full items-center gap-4">
                                    <div className="flex flex-col space-y-1.5">
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <Button variant="outline">Cancel</Button>
                                <Button>Deploy</Button>
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
                                <div className="grid w-full items-center gap-4">
                                    <div className="flex flex-col space-y-1.5">
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <Button variant="outline">Cancel</Button>
                                <Button>Deploy</Button>
                            </CardFooter>
                        </Card>
                    ))}
                </HorizontalScroll>
            </section>
        </div>
    );
};

export default Main;