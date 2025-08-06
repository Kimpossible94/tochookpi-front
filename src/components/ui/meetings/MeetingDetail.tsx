import React, {useEffect, useRef, useState} from "react";
import {Meeting, MEETING_CATEGORY_LABELS, MeetingLocation} from "@/redux/types/meeting";
import {Avatar, AvatarImage} from "@/components/ui/avatar";
import {Spinner} from "@/components/ui/spinner";
import api from "@/services/api";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {
    ArrowLeft,
    ArrowLeftFromLine,
    ArrowRightToLine,
    Calendar,
    Frown,
    Map,
    MapPin,
    Paperclip,
    PencilLine,
    PlayCircle,
    SendHorizonal,
    Trash,
    X,
    ZoomIn
} from "lucide-react";
import {Button} from "@/components/ui/button";
import {DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {useSelector} from "react-redux";
import {RootState} from "@/redux/store";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {Tabs, TabsContent} from "@/components/ui/tabs";
import ModifyMeeting from "@/pages/ModifyMeeting";
import UserBadge from "@/components/ui/user/userBadge";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {meetingReviewSchema} from "@/lib/schemas/meeting";
import {zodResolver} from "@hookform/resolvers/zod";

interface MeetingDetailProps {
    meetingId: number;
    onClosed?: () => void;
}

const MeetingDetail: React.FC<MeetingDetailProps> = ({ meetingId, onClosed }) => {
    const [meeting, setMeeting] = useState<Meeting | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [expand, setExpand] = useState<boolean>(false);
    const [tab, setTab] = useState<string>("detail");
    const [btnLoading, setBtnLoading] = useState(false);
    const { user } = useSelector((state: RootState) => state.user);
    const mapRef = useRef<naver.maps.Map | null>(null);
    type PreviewFile = {
        file: File;
        url: string;
    };
    const [previewFiles, setPreviewFiles] = useState<PreviewFile[]>([]);
    const [selectedMedia, setSelectedMedia] = useState<{
        file: File;
        type: "image" | "video";
        url: string;
    } | null>(null);

    const form = useForm<z.infer<typeof meetingReviewSchema>>({
        resolver: zodResolver(meetingReviewSchema),
        defaultValues: {
            meetingId: meetingId,
            writerId: user?.id,
            files: [],
            comments: '',
        },
    });

    useEffect(() => {
        fetchMeetingDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (meeting?.location) {
            initLocation(meeting.location);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [meeting]);

    const fetchMeetingDetails = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/meetings/${meetingId}`);
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
        if (!meeting || btnLoading || meeting.participating) return;
        setBtnLoading(true);

        try {
            await api.post(`/meetings/${meeting.id}/join`);

            setMeeting(prev => prev ?
                { ...prev, participating: true } : prev);
        } catch (error) {
            console.error("참여 실패:", error);
            //TODO: 참여 실패(토큰 만료, 이미 삭제된 모임, 종료된 모임 등)의 경우 에러처리 추가 해야함.
        } finally {
            setBtnLoading(false);
        }
    };

    const handleLeaveMeeting = async () => {
        if (!meeting || btnLoading || !meeting.participating) return;
        setBtnLoading(true);

        try {
            await api.post(`/meetings/${meeting.id}/leave`);

            setMeeting(prev => prev ?
                {...prev, participating: false } : prev);
        } catch (error) {
            console.error("나가기 실패:", error);
            // TODO: 토큰 만료, 모임 종료, 삭제된 모임 등 예외 처리
        } finally {
            setBtnLoading(false);
        }
    };

    const handleDeleteMeeting = async () => {
        if (!meeting || btnLoading) return;
        setBtnLoading(true);

        try {
            await api.delete(`/meetings/${meeting.id}`);
            if (onClosed) onClosed();
        } catch (error) {
            console.error("삭제 실패:", error);
            // TODO: 토큰 만료, 이미 삭제된 모임 등 예외 처리
        } finally {
            setBtnLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        if (files.length === 0) return;

        const newPreviewItems: PreviewFile[] = files.map(file => ({
            file,
            url: URL.createObjectURL(file),
        }));

        const updatedPreviewFiles = [...previewFiles, ...newPreviewItems];
        setPreviewFiles(updatedPreviewFiles);

        form.setValue("files", updatedPreviewFiles.map(p => p.file));
    };

    const removeFile = (index: number) => {
        const fileToRemove = previewFiles[index];

        URL.revokeObjectURL(fileToRemove.url);

        const newPreviewFiles = previewFiles.filter((_, i) => i !== index);
        setPreviewFiles(newPreviewFiles);

        form.setValue("files", newPreviewFiles.map(p => p.file));

        if (selectedMedia?.file === fileToRemove.file) {
            setSelectedMedia(null);
        }
    };

    const handleMediaClick = (file: File) => {
        setSelectedMedia({
            type: file.type.startsWith("image/") ? "image" : "video",
            file,
            url: previewFiles.find(p => p.file === file)?.url || "",
        });
    };

    const handleReviewSubmit = async (data: z.infer<typeof meetingReviewSchema>) => {
        const formData = new FormData();
        const { files, ...dtoWithoutFiles } = data;
        if (data.files) {
            data.files.forEach(file => {
                formData.append("files", file);
            });
        }
        formData.append('review', new Blob([JSON.stringify(dtoWithoutFiles)], {type: 'application/json'}));

        try {
            await api.post("/reviews", formData).then(() => {
                alert("성공적으로 등록되었습니다.")
            })
        } catch (error) {
            alert("등록에 실패했습니다.")
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
        <div className='flex flex-col h-full min-h-0'>
            <Tabs value={tab} className="w-full overflow-y-scroll">
                <TabsContent value="detail">
                    <DialogHeader className="shrink-0 py-5 border-b">
                        <DialogTitle className="flex flex-col sm:px-44">
                            <p className="text-sm text-green-500">{MEETING_CATEGORY_LABELS[meeting.category]}</p>
                            <div className="flex justify-between">
                                <div className="flex flex-col">
                                    <p className="text-3xl font-bold mt-2">{meeting.title}</p>
                                    <div className="text-sm flex mt-2 text-gray-600 gap-3">
                                        <p className="flex gap-1 items-center">
                                            <MapPin className="w-4 h-4"/>
                                            <span>{meeting.location?.title.replace(/<[^>]*>?/gm, "")}</span>
                                            <Map className="w-4 h-4 ml-1"/>
                                            <span>{meeting.location?.address}</span>
                                        </p>
                                        <p className="flex gap-1 items-center">
                                            <Calendar className="w-4 h-4"/>
                                            <span>{meeting.startDate} ~ {meeting.endDate}</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    {meeting.organizer?.id === user?.id && (
                                        <div className="flex gap-2">
                                            <AlertDialog>
                                                <AlertDialogTrigger>
                                                    <Button
                                                        className="self-center text-white bg-red-500 hover:bg-red-400 hover:text-white"
                                                        disabled={btnLoading}
                                                        variant='outline'
                                                    >
                                                        {btnLoading ? <Spinner size="small" />
                                                            : <div className="flex">
                                                                <Trash className="w-2 h-2 self-center mr-1" /> 삭제
                                                            </div>}
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>모임을 삭제하시겠습니까?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            삭제된 모임은 다시 복구할 수 없습니다.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>취소</AlertDialogCancel>
                                                        <AlertDialogAction onClick={handleDeleteMeeting}>삭제</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>

                                            <Button
                                                onClick={() => setTab('edit')}
                                                className="self-center"
                                            >
                                                {btnLoading ? <Spinner size="small" />
                                                    : <div className="flex">
                                                        <PencilLine className="w-2 h-2 self-center mr-1" /> 수정
                                                    </div>}
                                            </Button>
                                        </div>
                                    )}
                                    {meeting.participating ? (
                                        <Button
                                            onClick={handleLeaveMeeting}
                                            className="self-center"
                                            disabled={btnLoading}
                                            variant='outline'
                                        >
                                            {btnLoading ? <Spinner size="small" />
                                                : <div className="flex">
                                                    <ArrowLeftFromLine className="w-2 h-2 self-center mr-1" /> 나가기
                                                </div>}
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={handleJoinMeeting}
                                            className="self-center"
                                            disabled={btnLoading}
                                            variant="outline"
                                        >
                                            {btnLoading ? <Spinner size="small" />
                                                : <div className="flex">
                                                    <ArrowRightToLine className="w-2 h-2 self-center mr-1" /> 참여하기
                                                </div>}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </DialogTitle>
                        <DialogDescription className="hidden">
                            이 모임에 대한 자세한 정보를 확인하고 참여할 수 있습니다.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 h-full min-h-0 overflow-y-scroll
                                        sm:px-44 py-10">
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
                                        {meeting.participants?.map((user, idx) => (
                                            <div key={idx} className="flex text-sm">
                                                <UserBadge
                                                    user={user}
                                                    sizeClass="w-6 h-6"
                                                    shadow={false}
                                                    organizer={meeting.organizer.id === user.id}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="col-span-1 lg:col-span-6 flex flex-col mt-10">
                                <p className="text-md font-semibold my-2">어디서 모이나요 ?</p>
                                {meeting.location ?
                                    <div id="map" className="w-full h-72 rounded-3xl"/>
                                    : <div className="w-full h-72 content-center text-center bg-gray-50 rounded-3xl">
                                        <span>모임 장소를 설정하지 않았어요 🥲</span>
                                    </div>
                                }
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

                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(handleReviewSubmit)} className="w-full col-span-1 lg:col-span-6">
                                    <p className="text-md font-semibold my-2">모임 후기 남기기</p>
                                    {previewFiles.length > 0 && (
                                        <div className="flex w-full flex-wrap gap-4">
                                            {previewFiles.map((previewFile, index) => {
                                                const isImage = previewFile.file.type.startsWith("image/");

                                                return (
                                                    <div key={index} className="relative w-32 h-32 rounded overflow-hidden group shadow border">
                                                        {isImage ? (
                                                            <img src={previewFile.url} alt={`preview-${index}`} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <video src={previewFile.url} className="w-full h-full object-cover" muted />
                                                        )}

                                                        <button
                                                            type="button"
                                                            className="absolute bottom-1 left-1 bg-white text-black hover:bg-opacity-50 p-0.5 rounded"
                                                            onClick={() => handleMediaClick(previewFile.file)}
                                                        >
                                                            {isImage ? <ZoomIn className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="absolute top-1 right-1 bg-white text-black hover:bg-opacity-50 p-0.5 rounded"
                                                            onClick={() => removeFile(index)}
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {selectedMedia && (
                                        <div className="relative mt-4 border rounded-lg p-4">
                                            <button
                                                type="button"
                                                className="absolute top-1 right-1 bg-whitetext-black
                                                            hover:bg-opacity-50 p-0.5 rounded"
                                                onClick={() => setSelectedMedia(null)}
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                            {selectedMedia.type === "image" ? (
                                                <img src={selectedMedia.url} alt="selected" className="max-w-full max-h-96 mx-auto rounded" />
                                            ) : (
                                                <video controls className="max-w-full max-h-96 mx-auto rounded" src={selectedMedia.url} />
                                            )}
                                        </div>
                                    )}

                                    <div className="border-gray-300 border w-full rounded-md flex flex-col px-5 py-3 mt-2">
                                        <FormField
                                            control={form.control}
                                            name="comments"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel></FormLabel>
                                                    <FormControl>
                                                        <textarea
                                                            className="w-full resize-none outline-none"
                                                            rows={4}
                                                            placeholder="이번 모임에 대해서 한마디 남겨주세요."
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />

                                        <hr className="my-2" />

                                        <div className="flex w-full justify-between">
                                            <FormField
                                                control={form.control}
                                                name="files"
                                                render={() => (
                                                    <FormItem className="flex">
                                                        <FormLabel className={`cursor-pointer content-center hover:opacity-50
                                                                ${previewFiles.length > 0 && 'border rounded-md px-2 flex items-center'}
                                                                ${previewFiles.length > 10 && 'bg-red-600 text-white'}`}>
                                                            <Paperclip className="w-4 h-4" />
                                                            {previewFiles.length > 0 &&
                                                                (<span className="ml-1">{previewFiles.length} / 10</span>)}
                                                        </FormLabel>

                                                        <FormControl>
                                                            <input
                                                                type="file"
                                                                multiple
                                                                accept="image/*,video/*"
                                                                className="hidden"
                                                                onChange={handleFileChange}
                                                            />
                                                        </FormControl>
                                                        <FormMessage className="ml-2" />
                                                    </FormItem>
                                                )}
                                            />

                                            <Button type="submit" variant="outline">
                                                <SendHorizonal />
                                            </Button>
                                        </div>
                                    </div>
                                </form>
                            </Form>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="edit" className="mt-0">
                    <Button
                        onClick={() => setTab('detail')}
                        className="self-center border-none shadow-none hover:bg-transparent p-0 ml-5"
                        variant='outline'
                    >
                        {btnLoading ? <Spinner size="small" />
                            : <div className="flex self-end">
                                <ArrowLeft className="w-2 h-2" />
                            </div>}
                    </Button>
                    <ModifyMeeting meeting={meeting} />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default MeetingDetail;
