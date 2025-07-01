import React, {useEffect, useRef, useState} from "react";
import {Meeting, MEETING_CATEGORY_LABELS, MeetingLocation} from "@/redux/types/meeting";
import {Avatar, AvatarImage} from "@/components/ui/avatar";
import {Spinner} from "@/components/ui/spinner";
import api from "@/services/api";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Calendar, Crown, Frown, MapPin, UserRound} from "lucide-react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {Button} from "@/components/ui/button";
import {DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";

interface MeetingDetailProps {
    meetingId: number;
}

const MeetingDetail: React.FC<MeetingDetailProps> = ({ meetingId }) => {
    const [meeting, setMeeting] = useState<Meeting | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [expand, setExpand] = useState<boolean>(false);
    const [joining, setJoining] = useState(false);
    const mapRef = useRef<naver.maps.Map | null>(null);


    useEffect(() => {
        fetchMeetingDetails();
    }, []);

    useEffect(() => {
        if (meeting?.location) {
            initLocation(meeting.location);
        }
    }, [meeting]);

    const fetchMeetingDetails = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/meetings/${meetingId}`);
            response.data.participants = [
                {
                    id: 2,
                    username: '김영범',
                    email: '',
                    profileImage: '',
                    bio: '',
                    address: '',
                    userSetting: null
                }, {
                    id: 3,
                    username: '김영범2',
                    email: '',
                    profileImage: '',
                    bio: '',
                    address: '',
                    userSetting: null
                }, {
                    id: 4,
                    username: '김영범3',
                    email: '',
                    profileImage: '',
                    bio: '',
                    address: '',
                    userSetting: null
                }, {
                    id: 5,
                    username: '김영범444444',
                    email: '',
                    profileImage: '',
                    bio: '',
                    address: '',
                    userSetting: null
                }, {
                    id: 5,
                    username: '김영범444444',
                    email: '',
                    profileImage: '',
                    bio: '',
                    address: '',
                    userSetting: null
                }, {
                    id: 5,
                    username: '김영범444444',
                    email: '',
                    profileImage: '',
                    bio: '',
                    address: '',
                    userSetting: null
                }, {
                    id: 5,
                    username: '김영범444444',
                    email: '',
                    profileImage: '',
                    bio: '',
                    address: '',
                    userSetting: null
                }, {
                    id: 5,
                    username: '김영범444444',
                    email: '',
                    profileImage: '',
                    bio: '',
                    address: '',
                    userSetting: null
                },
            ];

            response.data.review = [
                {
                    images: [
                        "https://picsum.photos/300/300?random=1",
                        "https://picsum.photos/400/300?random=1",
                        "https://picsum.photos/400/300?random=1",
                    ],
                    comments: "정말 즐거운 시간이었습니다! 다음에도 꼭 다시 참석하고 싶어요.",
                    writer: {
                        id: 10,
                        username: "홍길동",
                        email: "",
                        profileImage: "https://i.pravatar.cc/150?img=10",
                        bio: "",
                        address: "",
                        userSetting: null
                    },
                    createdAt: "2025-06-01T12:34:56"
                },
                {
                    images: [],
                    comments: "생각보다 분위기가 너무 좋았고, 새로운 친구도 사귈 수 있었습니다.",
                    writer: {
                        id: 11,
                        username: "이순신",
                        email: "",
                        profileImage: "https://i.pravatar.cc/150?img=11",
                        bio: "",
                        address: "",
                        userSetting: null
                    },
                    createdAt: "2025-06-10T15:22:10"
                },
                {
                    images: ["https://picsum.photos/500/300?random=1"],
                    comments: "모임 장소도 깔끔했고, 주최자분도 친절했어요!",
                    writer: {
                        id: 12,
                        username: "강감찬",
                        email: "",
                        profileImage: "",
                        bio: "",
                        address: "",
                        userSetting: null
                    },
                    createdAt: "2025-06-20T09:12:45"
                },
                {
                    images: ["https://picsum.photos/500/300?random=1"],
                    comments: "모임 장소도 깔끔했고, 주최자분도 친절했어요!",
                    writer: {
                        id: 12,
                        username: "강감찬",
                        email: "",
                        profileImage: "",
                        bio: "",
                        address: "",
                        userSetting: null
                    },
                    createdAt: "2025-06-20T09:12:45"
                }
            ];

            setMeeting(response.data);
        } catch (error) {
            console.error("모임 데이터를 불러오는 중 오류 발생:", error);
            //TODO: 모임 데이터 못찾는 경우(삭제된 모임 또는 서버에러)에 대한 처리 추가해야함.
        } finally {
            setLoading(false);
        }
    };

    const initLocation = (location: MeetingLocation) => {
        if (typeof window !== "undefined" && window.naver && !mapRef.current) {
            const mapContainer = document.getElementById("map");

            if (mapContainer) {
                const mapOptions: naver.maps.MapOptions = {
                    center: new naver.maps.LatLng(location.lat, location.lng), //지도의 초기 중심 좌표
                    zoom: 14, //지도의 초기 줌 레벨
                    minZoom: 7, //지도의 최소 줌 레벨
                    zoomControl: true, //줌 컨트롤의 표시 여부
                    zoomControlOptions: { //줌 컨트롤의 옵션
                        position: naver.maps.Position.TOP_RIGHT
                    },
                }

                const map = new naver.maps.Map(mapContainer, mapOptions);
                mapRef.current = map;
                addMapMarker(location.title, location.lng, location.lat, location.address);
            }
        }
    }

    const addMapMarker = (title: string, lng: number, lat: number, address: string) => {
        let newMarker = new naver.maps.Marker({
            position: new naver.maps.LatLng(lat, lng),
            map: mapRef.current!,
            title: title,
            clickable: true,
        })

        const infowindow = new naver.maps.InfoWindow({
            content: `<div class="bg-white p-3 rounded-lg shadow-lg font-sans max-w-3xs text-center">
                        <h3 class="my-1 text-base font-bold">${title}</h3>
                        <p class="m-0 text-gray-700" style="font-size: 14px">${address}</p>
                      </div>`
        });

        setTimeout(() => {
            infowindow.open(mapRef.current!, newMarker);
        }, 100);
    }

    const handleJoinMeeting = async () => {
        if (!meeting || joining || meeting.participating) return;
        setJoining(true);

        try {
            await api.post(`/meetings/${meeting.id}/join`);

            setMeeting(prev => prev ?
                { ...prev, participating: true, currentParticipantsCnt: prev.currentParticipantsCnt + 1 } : prev);
        } catch (error) {
            console.error("참여 실패:", error);
            //TODO: 참여 실패(토큰 만료, 이미 삭제된 모임, 종료된 모임 등)의 경우 에러처리 추가 해야함.
        } finally {
            setJoining(false);
        }
    };

    const handleLeaveMeeting = async () => {
        if (!meeting || joining || !meeting.participating) return;
        setJoining(true);

        try {
            await api.post(`/meetings/${meeting.id}/leave`);

            setMeeting(prev => prev ?
                {...prev, participating: false, currentParticipantsCnt: prev.currentParticipantsCnt - 1 } : prev);
        } catch (error) {
            console.error("나가기 실패:", error);
            // TODO: 토큰 만료, 모임 종료, 삭제된 모임 등 예외 처리
        } finally {
            setJoining(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <Spinner size="large" show={true} className="align-middle">
                    <p className="mt-2">모임 데이터를 불러오는 중</p>
                </Spinner>
            </div>
        );
    }

    if (!meeting) {
        return (
            <div className="p-6 flex justify-center text-center gap-2 h-full">
                <Frown className="w-5 h-5 self-center" />
                <span className="self-center">모임 정보를 불러올 수 없습니다.</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full min-h-0">
            <DialogHeader className="shrink-0 py-5 border-b">
                <DialogTitle className="flex flex-col sm:px-44">
                    <p className="text-sm text-green-500">{MEETING_CATEGORY_LABELS[meeting.category]}</p>
                    <div className="flex justify-between">
                        <div className="flex flex-col">
                            <p className="text-3xl font-bold mt-2">{meeting.title}</p>
                            <div className="text-sm flex mt-2 text-gray-600 gap-3">
                                <p className="flex gap-1 items-center">
                                    <UserRound className="w-4 h-4"/>
                                    <span>{meeting.currentParticipantsCnt} / {meeting.maxParticipantsCnt}</span>
                                </p>
                                <p className="flex gap-1 items-center">
                                    <MapPin className="w-4 h-4"/>
                                    <span>{meeting.location?.address}</span>
                                </p>
                                <p className="flex gap-1 items-center">
                                    <Calendar className="w-4 h-4"/>
                                    <span>{meeting.startDate} ~ {meeting.endDate}</span>
                                </p>
                            </div>
                        </div>
                        {meeting.participating ? (
                            <Button
                                onClick={handleLeaveMeeting}
                                className="self-center text-red-500 border-red-500 hover:text-red-500"
                                disabled={joining}
                                variant='outline'
                            >
                                {joining ? <Spinner size="small" /> : "나가기"}
                            </Button>
                        ) : (
                            <Button
                                onClick={handleJoinMeeting}
                                className="self-center"
                                disabled={joining}
                            >
                                {joining ? <Spinner size="small" /> : "참여하기"}
                            </Button>
                        )}
                    </div>
                </DialogTitle>
                <DialogDescription className="hidden">
                    이 모임에 대한 자세한 정보를 확인하고 참여할 수 있습니다.
                </DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 h-full min-h-0 overflow-y-scroll sm:px-44 pt-10">
                    {meeting.image && (
                        <div className="col-span-1 lg:col-span-6 lg:row-span-1 w-full">
                            <img
                                src={meeting.image}
                                alt=""
                                className={meeting.image ? 'object-contain h-52 rounded-3xl' : ''}
                            />
                        </div>
                    )}

                    <div className="col-span-1 lg:col-span-4 flex flex-col gap-4">
                        <p className="text-lg font-bold">상세내용</p>
                        <p className={`text-sm whitespace-pre-line ${expand ? "" : "line-clamp-4"}`}>
                            {meeting.description}
                            {meeting.description}
                            {meeting.description}
                        </p>
                        <Button onClick={() => setExpand(!expand)}
                                className="text-blue-500 text-xs self-start bg-transparent shadow-none p-0 hover:bg-transparent">
                            {expand ? "접기" : "더보기"}
                        </Button>
                    </div>

                    <Card className="col-span-1 lg:col-span-2 flex flex-col max-h-60">
                        <CardHeader className="pt-3 px-3 pb-0">
                            <CardTitle className="flex flex-col">
                                <p>참가자</p>
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="m-3 mt-4 p-0 overflow-y-scroll">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                                <div className="flex text-sm col-span-1">
                                    <Avatar className="w-6 h-6">
                                        <AvatarImage
                                            src={meeting.organizer.profileImage || "https://github.com/shadcn.png"}/>
                                    </Avatar>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div className="flex">
                                                    <span className="ml-1 content-center truncate cursor-default">
                                                        {meeting.organizer.username}
                                                    </span>
                                                    <Crown className="w-4 h-4 ml-1 self-center text-yellow-500"/>
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent side="top">
                                                {meeting.organizer.username}
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>

                                {meeting.participants?.map((user, idx) => (
                                    <div key={idx} className="flex text-sm">
                                        <Avatar className="w-6 h-6">
                                            <AvatarImage src={user.profileImage || "https://github.com/shadcn.png"}/>
                                        </Avatar>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <span className="ml-1 content-center truncate cursor-default">
                                                        {user.username}
                                                    </span>
                                                </TooltipTrigger>
                                                <TooltipContent side="top">
                                                    {user.username}
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="col-span-1 lg:col-span-6 flex flex-col mt-10">
                        <p className="text-md font-semibold my-2">어디서 모이나요 ?</p>
                        <div id="map" className="w-full h-72 rounded-3xl"/>
                    </div>

                    <div className="col-span-1 lg:col-span-6 flex flex-col mt-10 min-h-72">
                        <p className="text-md font-semibold my-2">모임 후기</p>

                        {meeting.review && meeting.review.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-10">
                                {meeting.review.map((review, index) => (
                                    <Card key={index} className="p-4 space-y-3">
                                        <div className="flex items-center gap-2">
                                            <Avatar className="w-7 h-7">
                                                <AvatarImage
                                                    src={review.writer.profileImage || "https://github.com/shadcn.png"}/>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium">{review.writer.username}</span>
                                                {review.createdAt && (
                                                    <span
                                                        className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                                                )}
                                            </div>
                                        </div>

                                        <p className="text-sm text-gray-800 whitespace-pre-line">{review.comments}</p>

                                        {review.images.length > 0 && (
                                            <div className="grid grid-cols-2 gap-2">
                                                {review.images.map((imgUrl, imgIdx) => (
                                                    <img
                                                        key={imgIdx}
                                                        src={imgUrl}
                                                        alt={`후기 이미지 ${imgIdx + 1}`}
                                                        className="w-full h-32 object-cover rounded-md"
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="flex justify-center items-center min-h-full">
                                <p className="text-sm text-gray-500 mt-2">아직 등록된 후기가 없습니다.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MeetingDetail;
