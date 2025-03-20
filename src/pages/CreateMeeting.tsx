import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { DateTimePicker24h } from "@/components/ui/DateTimePicker24h";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {DateRange} from "react-day-picker";
import { addDays, format } from "date-fns";

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

    const { watch, setValue } = form;
    const [activeField, setActiveField] = useState<string | null>(null);
    const [schedules, setSchedules] = useState<{ date: string; events: any[] }[]>([]);
    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(),
        to: addDays(new Date(), 7),
    });

    const onSubmit = (values: z.infer<typeof meetingSchema>) => {
        console.log(values);
    };

    return (
        <div className="h-screen flex pt-20 space-y-10 px-32">
            <div className="w-1/2 p-8">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem onClick={() => setActiveField(null)}>
                                    <FormLabel>모임명</FormLabel>
                                    <FormControl>
                                        <Input placeholder="모임 이름 입력" {...field} />
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
                                    <FormLabel>설명</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="모임 설명 입력" {...field} />
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
                                    <FormLabel>위치</FormLabel>
                                    <FormControl>
                                        <Input placeholder="위치 선택" {...field} />
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
                                    <FormLabel>이미지 URL</FormLabel>
                                    <FormControl>
                                        <Input placeholder="이미지 URL 입력" {...field} />
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
                                    <FormLabel>최대 참가자 수</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
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
                                    <FormLabel>모임 일정</FormLabel>
                                    <FormControl>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="w-[300px] justify-start text-left font-normal"
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
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormItem onClick={() => setActiveField("schedules")}>
                            <FormLabel>세부 일정</FormLabel>
                            <FormControl>
                                <Button type="button">일정 추가</Button>
                            </FormControl>
                        </FormItem>

                        <Button type="submit" className="mt-4 w-full">
                            모임 만들기
                        </Button>
                    </form>
                </Form>
            </div>

            <Card className="w-1/2 p-8 flex items-center justify-center">
                {activeField === "location" && <div>위치를 입력하세요.</div>}
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
            </Card>
        </div>
    );
};

export default CreateMeeting;
