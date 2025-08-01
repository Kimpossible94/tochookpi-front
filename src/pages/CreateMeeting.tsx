import React, {useEffect, useRef, useState} from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {Textarea} from "@/components/ui/textarea";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {CalendarIcon, MapPin, MapPinX} from "lucide-react";
import {Calendar} from "@/components/ui/calendar";
import {DateRange} from "react-day-picker";
import {addDays, format} from "date-fns";
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@/components/ui/resizable";
import api from "@/services/api";
import {FilePond} from 'react-filepond'
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {MEETING_CATEGORIES, MEETING_CATEGORY_LABELS} from "@/redux/types/meeting";
import {meetingSchema} from "@/lib/schemas/meeting";
import {UserInfo} from "@/redux/types/user";
import UserBadge from "@/components/ui/user/userBadge";

const CreateMeeting = () => {
    const [activeField, setActiveField] = useState<string | null>(null);
    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(),
        to: addDays(new Date(), 7),
    });
    const [map, setMap] = useState<naver.maps.Map | undefined>(undefined);
    const [nonParticipants, setNonParticipants] = useState<UserInfo[]>([]);
    const [participants, setParticipants] = useState<UserInfo[]>([]);
    const mapMarkerList = useRef<naver.maps.Marker[]>([]);
    const infoWindowList = useRef<naver.maps.InfoWindow[]>([]);

    const form = useForm<z.infer<typeof meetingSchema>>({
        resolver: zodResolver(meetingSchema),
        defaultValues: {
            title: "",
            description: "",
            category: "",
            location: undefined,
            participants: [],
            image: undefined,
            startDate: date?.from?.toISOString(),
            endDate: date?.to?.toISOString(),
        },
    });

    const { setValue } = form;

    useEffect(() => {
        if (activeField === "location" && typeof window !== "undefined" && window.naver && !map) {
            const mapContainer = document.getElementById("map");

            if (mapContainer) {
                const mapOptions: naver.maps.MapOptions = {
                    center: new naver.maps.LatLng(37.3595704, 127.105399), //지도의 초기 중심 좌표
                    zoom: 15, //지도의 초기 줌 레벨
                    minZoom: 7, //지도의 최소 줌 레벨
                    zoomControl: true, //줌 컨트롤의 표시 여부
                    zoomControlOptions: { //줌 컨트롤의 옵션
                        position: naver.maps.Position.TOP_RIGHT
                    },
                }

                const map = new naver.maps.Map(mapContainer, mapOptions);
                setMap(map);

                naver.maps.Event.addListener(map, "click", () => {
                    infoWindowList.current.forEach(infoWindow => {
                        infoWindow.close();
                    })
                });
            }
        }

        if (activeField === "participants") {
            api.get("/users/summary").then(response => {
                setNonParticipants(response.data);
            });
        }
    }, [activeField, map]);

    const handleLocationSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            event.preventDefault();
            if (!map) {
                alert("검색 중 에러 발생 !");
                return;
            }

            const target = event.target as HTMLInputElement;

            naver.maps.Service.geocode({ query: target.value }, function (status, response) {
                if (status !== naver.maps.Service.Status.OK) return;
                removeAllMapMarker();
                removeAllinfoWindow();

                if(response.v2.addresses.length <= 0) {
                    api.get(`/naver/search/local?query=${target.value}`).then(response => {
                        if(response.data.length <= 0) {
                            alert("검색결과가 없습니다.");
                            return;
                        }

                        for (let i = 0; i < response.data.length; i++) {
                            const data = response.data[i];
                            const lng = data.mapx / 1e7; // 경도 (x 값)
                            const lat = data.mapy / 1e7;  // 위도 (y 값)
                            addMapMarker(data.title, lng, lat, data.roadAddress);
                            if (i === 0) map.setCenter(new naver.maps.LatLng(lat, lng));
                        }
                    });
                } else {
                    const addressItem = response.v2.addresses[0];
                    const lng = Number(addressItem.x);
                    const lat = Number(addressItem.y);
                    let title = target.value;

                    for (const e of response.v2.addresses[0].addressElements) {
                        if(e.types[0] === 'BUILDING_NAME' && e.shortName !== '') {
                            title = e.shortName;
                            break;
                        }
                    }

                    addMapMarker(title, lng, lat, addressItem.roadAddress || addressItem.jibunAddress);
                    map.setCenter(new naver.maps.LatLng(Number(addressItem.y), Number(addressItem.x)));
                }
            });
        }
    };

    const removeAllMapMarker = () => {
        // 메모리 해제를 위해서 null 처리
        mapMarkerList.current.forEach(marker => marker.setMap(null));
        mapMarkerList.current = [];
    }

    const removeAllinfoWindow = () => {
        // 메모리 해제를 위해서 null 처리
        infoWindowList.current.forEach(window => window.setMap(null));
        infoWindowList.current = [];
    }

    const addMapMarker = (title: string, lng: number, lat: number, address: string) => {
        let newMarker = new naver.maps.Marker({
            position: new naver.maps.LatLng(lat, lng),
            map: map,
            title: title,
            clickable: true,
        })

        const infowindow = new naver.maps.InfoWindow({
            content: `<div class="bg-white p-3 rounded-lg shadow-lg font-sans max-w-3xs text-center">
                        <h3 class="my-1 text-base font-bold">${title}</h3>
                        <p class="m-0 text-gray-700" style="font-size: 14px">${address}</p>
                        <button id="setLocationBtn_${lat}_${lng}" class="mt-2 px-3 py-1 bg-blue-500 text-white rounded">
                            위치 설정
                        </button>
                      </div>`
        });

        naver.maps.Event.addListener(newMarker, 'click', () => {
            if (infowindow.getMap()) {
                infowindow.close();
            } else {
                infowindow.open(map!, newMarker);

                setTimeout(() => {
                    const btn = document.getElementById(`setLocationBtn_${lat}_${lng}`);
                    if (btn) {
                        btn.addEventListener('click', () => {
                            setValue("location", { title, address, lng, lat });
                        });
                    }
                }, 0);
            }
        });

        mapMarkerList.current.push(newMarker);
        infoWindowList.current.push(infowindow);
    }

    const addParticipant = (user: UserInfo) => {
        if (!participants.find(p => p.id === user.id)) {
            setParticipants([...participants, user]);
        }
    };

    const removeParticipant = (user: UserInfo) => {
        setParticipants(participants.filter(p => p.id !== user.id));
    };

    const onSubmit = async (values: z.infer<typeof meetingSchema>) => {
        const formData = new FormData();
        setValue("participants", participants.map((p) => p.id));
        const { image, ...dtoWithoutImage } = values;
        if (values.image) formData.append("image", values.image);

        formData.append('meeting', new Blob([JSON.stringify(dtoWithoutImage)], {type: 'application/json'}));

        try {
            await api.post("/meetings", formData).then(() => {
                alert("성공적으로 등록되었습니다.")
            })
        } catch (error) {
            alert("등록에 실패했습니다.")
        }
    };

    return (
        <div className="flex py-10 px-20 h-full">
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel defaultSize={40}>
                    <div className="pr-8 pl-1 h-full overflow-y-auto flex justify-center items-start scrollbar-hide">
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-3 w-full"
                            >
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-bold">모임명</FormLabel>
                                            <FormControl>
                                                <Input placeholder="모임명을 입력해 주세요." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-bold">설명</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="이번 모임은 어떤 모임인지 설명해 주세요. (예: 축구를 사랑하는 모임)" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="location"
                                    render={({ field }) => (
                                        <FormItem onFocus={() => setActiveField("location")}>
                                            <FormLabel className="font-bold">위치</FormLabel>
                                            <FormControl>
                                                    <Input
                                                        placeholder="어디서 모이는지 검색해주세요."
                                                        onKeyDown={handleLocationSearch}
                                                    />
                                            </FormControl>
                                            <div className="relative border rounded-xl p-4 bg-gray-50">
                                                <p className="text-sm text-gray-700 font-semibold mb-2">선택된 장소</p>
                                                {field.value?.title ? (
                                                    <div className="flex justify-between items-center">
                                                        <div className="flex items-center">
                                                            <MapPin />
                                                            {field.value?.title && (
                                                                <div className="ml-1">
                                                                    <p className="text-base text-gray-900 font-bold">
                                                                        {field.value?.title.replace(/<[^>]*>/g, '')}
                                                                    </p>
                                                                    {field.value?.address && (
                                                                        <p className="text-sm text-gray-600">{field.value?.address}</p>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => field.onChange(undefined)}
                                                            className="text-red-400 hover:text-red-600"
                                                        >
                                                            <MapPinX size={18}/>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="text-sm text-gray-600">검색 후 장소 선택을 해야 적용됩니다.</div>
                                                )}
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="image"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel className="font-bold">대표 이미지</FormLabel>
                                            <FormControl>
                                                <FilePond
                                                    allowMultiple={false}
                                                    acceptedFileTypes={['image/*']}
                                                    name="image"
                                                    files={field.value instanceof File ? [field.value] : []}
                                                    onupdatefiles={(fileItems) => {
                                                        const file = fileItems[0]?.file ?? undefined;
                                                        field.onChange(file);

                                                    }}
                                                    labelIdle='드래그해서 올리거나 <span class="filepond--label-action w-full">클릭해서 업로드</span>'
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-2 gap-5">
                                    <FormField
                                        control={form.control}
                                        name="category"
                                        render={({field}) => (
                                            <FormItem className="col-span-1">
                                                <FormLabel className="font-bold">카테고리</FormLabel>
                                                <FormControl>
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="카테고리를 선택하세요"/>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {MEETING_CATEGORIES.map((cat) => (
                                                                <SelectItem key={cat}
                                                                            value={cat}
                                                                            className="py-2"
                                                                >
                                                                    {MEETING_CATEGORY_LABELS[cat]}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="startDate"
                                        render={() => (
                                            <FormItem>
                                                <FormLabel className="font-bold">모임 일자</FormLabel>
                                                <FormControl>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                className="w-full font-normal"
                                                            >
                                                                <CalendarIcon/>
                                                                {date?.from ? (
                                                                    date.to ? (
                                                                        `${format(date.from, "LLL dd, y")} - ${format(date.to, "LLL dd, y")}`
                                                                    ) : (
                                                                        format(date.from, "LLL dd, y")
                                                                    )
                                                                ) : (
                                                                    <span>Pick a date</span>
                                                                )}
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0" align="start">
                                                            <Calendar
                                                                initialFocus
                                                                mode="range"
                                                                defaultMonth={date?.from}
                                                                selected={date}
                                                                onSelect={(range) => {
                                                                    setDate(range);
                                                                    setValue("startDate", range?.from?.toISOString() || "");
                                                                    setValue("endDate", range?.to?.toISOString() || "");
                                                                }}
                                                                numberOfMonths={2}
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                </FormControl>
                                                {form.formState.errors.startDate && (
                                                    <p className="text-red-500 text-sm mt-1">
                                                        {form.formState.errors.startDate.message}
                                                    </p>
                                                )}
                                                {form.formState.errors.endDate && (
                                                    <p className="text-red-500 text-sm mt-1">
                                                        {form.formState.errors.endDate.message}
                                                    </p>
                                                )}
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="pt-10 flex flex-col gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="col-span-1 border-2"
                                        onClick={() => setActiveField("participants")}
                                    >
                                        참여자 설정
                                    </Button>

                                    <Button type="submit" className="w-full">
                                        모임 만들기
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                </ResizablePanel>

                <ResizableHandle withHandle />

                <ResizablePanel defaultSize={50}>
                    <div className="h-full overflow-y-auto flex justify-center items-start scrollbar-hide">
                        <div
                            id="map"
                            className="h-full w-full"
                            style={{ display: activeField === "location" ? "block" : "none" }}
                        />

                        {!activeField && <p className="text-gray-500 h-full content-center">항목을 선택하면 여기 표시됩니다.</p>}

                        {activeField === "participants" && (
                            <div className="flex flex-col h-full p-4 w-full">
                                <div>
                                    <h3 className="font-bold">참가하지 않은 사람</h3>
                                    <span className="text-sm text-gray-500">클릭해서 참가자로 추가</span>
                                    <div className="mt-3 flex flex-wrap overflow-auto gap-3 min-h-40">
                                        {nonParticipants
                                            .filter(np => !participants.find(p => p.id === np.id))
                                            .map(user => (
                                                <UserBadge key={user.id}
                                                           user={user}
                                                           sizeClass="w-7 h-7"
                                                           organizer={false}
                                                           shadow={true}
                                                           onClick={() => addParticipant(user)} />
                                            ))}
                                    </div>
                                </div>

                                <hr className="my-4" />

                                <div>
                                    <h3 className="font-bold">참가자 목록</h3>
                                    <span className="text-sm text-gray-500">클릭해서 참가자 목록에서 제거</span>
                                    <div className="mt-3 flex flex-wrap overflow-auto gap-3 min-h-40">
                                        {participants.map(user => (
                                            <UserBadge key={user.id}
                                                       user={user}
                                                       sizeClass="w-7 h-7"
                                                       organizer={false}
                                                       shadow={true}
                                                       onClick={() => removeParticipant(user)} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
};

export default CreateMeeting;
