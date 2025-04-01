import React, {useEffect, useState} from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {DateTimePicker24h} from "@/components/ui/DateTimePicker24h";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Textarea} from "@/components/ui/textarea";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {CalendarIcon, Plus} from "lucide-react";
import {Calendar} from "@/components/ui/calendar";
import {DateRange} from "react-day-picker";
import {addDays, format} from "date-fns";
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@/components/ui/resizable";
import {Slider} from "@/components/ui/slider";
import api from "@/services/api";

// 유효성 검사 스키마
const meetingSchema = z.object({
    title: z.string().min(1, "모임 제목을 입력하세요."),
    description: z.string().optional(),
    location: z.string().optional(),
    image: z.string().optional(),
    period: z.object({
        startDate: z.string().min(1, "시작 날짜를 입력하세요."),
        endDate: z.string().min(1, "종료 날짜를 입력하세요."),
    }),
    schedules: z
        .array(
            z.object({
                date: z.string().min(1, "날짜를 입력하세요."),
                events: z.array(
                    z.object({
                        startTime: z.string().min(1, "시작 시간을 입력하세요."),
                        endTime: z.string().min(1, "종료 시간을 입력하세요."),
                        description: z.string().min(1, "일정 설명을 입력하세요."),
                    })
                ),
            })
        )
        .optional(),
    maxParticipantsCnt: z.number().min(1, "최소 1명 이상 설정해야 합니다."),
});

const CreateMeeting = () => {
    const [activeField, setActiveField] = useState<string | null>(null);
    const [schedules, setSchedules] = useState<{ date: string; events: any[] }[]>([]);
    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(),
        to: addDays(new Date(), 7),
    });
    const [map, setMap] = useState<naver.maps.Map | undefined>(undefined);

    const form = useForm({
        resolver: zodResolver(meetingSchema),
        defaultValues: {
            title: "",
            description: "",
            location: "",
            image: "",
            maxParticipantsCnt: 5,
            period: { startDate: "", endDate: "" },
            schedules: [],
        },
    });

    const mapMarkerList: naver.maps.Marker[] = [];
    const { watch, setValue } = form;

    useEffect(() => {
        if (activeField === "location" && typeof window !== "undefined" && window.naver) {
            const mapContainer = document.getElementById("map");

            if (mapContainer) {
                const mapOptions: naver.maps.MapOptions = {
                    center: new naver.maps.LatLng(37.3595704, 127.105399), //지도의 초기 중심 좌표
                    zoom: 13, //지도의 초기 줌 레벨
                    minZoom: 7, //지도의 최소 줌 레벨
                    zoomControl: true, //줌 컨트롤의 표시 여부
                    zoomControlOptions: { //줌 컨트롤의 옵션
                        position: naver.maps.Position.TOP_RIGHT
                    },
                }

                const map = new naver.maps.Map(mapContainer, mapOptions);
                setMap(map);

                new naver.maps.Marker({
                    position: new naver.maps.LatLng(37.3595704, 127.105399),
                    map: map
                })
            }
        }
    }, [activeField]);

    const handleLocationSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            event.preventDefault();
            const target = event.target as HTMLInputElement;

            naver.maps.Service.geocode({ query: target.value }, function (status, response) {
                if (status !== naver.maps.Service.Status.OK) {
                    return;
                }

                console.log(response.v2.addresses);

                if(response.v2.addresses.length <= 0) {
                    api.get(`/naver/search/local?query=${target.value}`).then(response => {
                        if(response.data.length <= 0) alert("검색결과가 없습니다.");
                        console.log(response.data);
                        for (const data of response.data) {
                            const lng = data.mapx / 1e7; // 경도 (x 값)
                            const lat = data.mapy / 1e7;  // 위도 (y 값)
                            addMapMarker(data.title, lng, lat, data.roadAddress);
                        }
                    });
                }
            });
        }
    };

    const addMapMarker = (title: string, lng: number, lat: number, address: string) => {
        if (!map) {
            alert("마커 표시중 에러 발생");
            return;
        }
        
        let newMarker = new naver.maps.Marker({
            position: new naver.maps.LatLng(lat, lng),
            map: map,
            title: title,
            clickable: true,
        })
        mapMarkerList.push(newMarker);

        const infowindow = new naver.maps.InfoWindow({
            content: `<div class="bg-white p-3 rounded-lg shadow-lg font-sans max-w-3xs text-center">
                        <h3 class="my-1 text-base font-bold">${title}</h3>
                        <p class="m-0 text-gray-700" style="font-size: 14px">${address}</p>
                      </div>`,
        });

        naver.maps.Event.addListener(newMarker, 'click', () => {
            if (infowindow.getMap()) {
                infowindow.close();
            } else {
                infowindow.open(map, newMarker);
            }
        });

        naver.maps.Event.addListener(map, "click", () => {
            infowindow.close();
        });
    }

    const onSubmit = (values: z.infer<typeof meetingSchema>) => {
        console.log(values);
    };

    return (
        <div className="flex pt-20 px-20 h-screen">
            <ResizablePanelGroup
                direction="horizontal"
            >
                <ResizablePanel
                    defaultSize={40}
                >
                    <div className="pr-8 pl-1 h-full overflow-y-scroll flex justify-center items-center scrollbar-hide">
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-5"
                            >
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem onClick={() => setActiveField(null)}>
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
                                        <FormItem onClick={() => setActiveField(null)}>
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
                                        <FormItem onClick={() => setActiveField("location")}>
                                            <FormLabel className="font-bold">위치</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="어디서 모이는지 알려주세요."
                                                    {...field}
                                                    onKeyDown={handleLocationSearch}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="image"
                                    render={({ field }) => (
                                        <FormItem onClick={() => setActiveField(null)}>
                                            <FormLabel className="font-bold">이미지 URL</FormLabel>
                                            <FormControl>
                                                <Input placeholder="모임을 대표하는 이미지가 있다면 넣어주세요." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="maxParticipantsCnt"
                                    render={({ field }) => (
                                        <FormItem onClick={() => setActiveField(null)}>
                                            <FormLabel className="font-bold">최대 참가자 수</FormLabel>
                                            <FormControl>
                                                <div className="grid grid-cols-6 gap-5">
                                                    <Slider
                                                        min={1}
                                                        max={40}
                                                        step={1}
                                                        value={[field.value || 0]}
                                                        onValueChange={(value) => field.onChange(value[0])}
                                                        className="col-span-5"
                                                    />
                                                    <Input
                                                        type="number"
                                                        value={field.value || undefined}
                                                        onChange={(e) =>
                                                            field.onChange(Math.min(40, Number(e.target.value)))}
                                                        className="col-span-1"
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="period"
                                    render={() => (
                                        <FormItem>
                                            <FormLabel className="font-bold">모임 일자</FormLabel>
                                            <FormControl>
                                                <div className="grid grid-cols-4 gap-7">
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                className="w-full font-normal col-span-3"
                                                            >
                                                                <CalendarIcon />
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
                                                                    setValue("period.startDate", range?.from?.toISOString() || "");
                                                                    setValue("period.endDate", range?.to?.toISOString() || "");
                                                                }}
                                                                numberOfMonths={2}
                                                            />
                                                        </PopoverContent>
                                                    </Popover>

                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        className="col-span-1 border-2"
                                                        onClick={() => setActiveField("schedules")}
                                                    >
                                                        <Plus />
                                                        세부 일정
                                                    </Button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="pt-10">
                                    <Button type="submit" className="w-full">
                                        모임 만들기
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                </ResizablePanel>

                <ResizableHandle withHandle />

                <ResizablePanel defaultSize={60}>
                    <div className="h-full flex justify-center items-center">
                        {activeField === "location" && <div id="map" className="h-full w-full"/>}
                        {activeField === "schedules" && (
                            <div className="w-full">
                                <h2 className="text-xl font-semibold mb-2">일정 입력</h2>
                                <ScrollArea className="h-[300px] border rounded-md p-2">
                                    {schedules.map((schedule, index) => (
                                        <div key={index} className="mb-4 p-2 border rounded-md">
                                            <p className="font-medium">날짜: {schedule.date}</p>
                                            {schedule.events.map((event, i) => (
                                                <div key={i} className="ml-4">
                                                    <p>🕒 {event.startTime} - {event.endTime}</p>
                                                    <p>📌 {event.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </ScrollArea>

                                <div className="mt-4 space-y-2">
                                    <p className="text-gray-600">날짜 선택</p>
                                    <DateTimePicker24h
                                        value={watch("period.startDate") ? new Date(watch("period.startDate")) : undefined}
                                        onChange={(date) => {
                                            if (date) {
                                                setValue("period.startDate", date.toISOString());
                                            }
                                        }}
                                    />

                                    <p className="text-gray-600 mt-4">종료 날짜 선택</p>
                                    <DateTimePicker24h
                                        value={watch("period.endDate") ? new Date(watch("period.endDate")) : undefined}
                                        onChange={(date) => {
                                            if (date) {
                                                setValue("period.endDate", date.toISOString());
                                            }
                                        }}
                                    />

                                    <Button
                                        className="mt-4"
                                        onClick={() => {
                                            const newSchedule = {
                                                date: watch("period.startDate"),
                                                events: [],
                                            };
                                            setSchedules((prev) => [...prev, newSchedule]);
                                        }}
                                    >
                                        일정 추가
                                    </Button>
                                </div>
                            </div>
                        )}
                        {!activeField && <p className="text-gray-500">항목을 선택하면 여기 표시됩니다.</p>}
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
};

export default CreateMeeting;
