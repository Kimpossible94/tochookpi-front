import React from "react";
import {Meeting} from "@/types/meeting";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";

// 더미 데이터
const dummyMeetings: Meeting[] = [
    {
        id: "1",
        image: "/path/to/hot-meeting1.jpg",
        title: "서울 방탈출",
        description: "강남에서 방탈출할 사람~",
        currentParticipantsCnt: 2,
        maxParticipantsCnt: 15,
        participants: ["강광일", "김영범"],
    },
    {
        id: "2",
        image: "/path/to/hot-meeting2.jpg",
        title: "방어회 먹자",
        description: "가락시장역, 너만오면 고",
        currentParticipantsCnt: 6,
        maxParticipantsCnt: 25,
        participants: ["강광일", "김영범", "방원", "엄윤호", "이헌", "김재훈"],
    },
    {
        id: "3",
        image: "/path/to/recent-meeting1.jpg",
        title: "칼바람 전사 모집",
        description: "전사의 심장이 울린다 둥둥둥..",
        currentParticipantsCnt: 1,
        maxParticipantsCnt: 10,
        participants: ["김영범"],
    },
];

const categories = [
    { label: "게임", value: "game" },
    { label: "음식", value: "food" },
    { label: "전시회", value: "exhibition" },
    { label: "운동", value: "sports" },
    { label: "여행", value: "travel" },
    { label: "스터디", value: "study" },
];

const FilterSchema = z.object({
    category: z.string().optional(),
    searchTerm: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
});

type FilterFormType = z.infer<typeof FilterSchema>;

const MeetingListPage: React.FC = () => {
    const form = useForm<FilterFormType>({
        resolver: zodResolver(FilterSchema),
        defaultValues: {
            category: "",
            searchTerm: "",
            startDate: "",
            endDate: "",
        }
    })

    function onSubmit(data: FilterFormType) {
        console.log("필터 데이터:", data);
    }

    return (
        <div className="flex flex-col lg:flex-row p-20 gap-4">
            {/* 모임 목록 */}
            <div className="lg:w-3/4 mr-5">
                <h2 className="text-2xl font-bold">모임 목록</h2>
                <div className="flex flex-col gap-4">
                    {dummyMeetings.map((meeting) => (
                        <Card key={meeting.id}>
                            <div className="flex items-center">
                                <img
                                    src={meeting.image}
                                    alt={meeting.title}
                                    className="w-32 h-32 object-cover rounded-l-md"
                                />
                                <CardContent className="p-4 flex-1">
                                    <h3 className="text-lg font-semibold">{meeting.title}</h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {meeting.description}
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        {meeting.currentParticipantsCnt} /{" "}
                                        {meeting.maxParticipantsCnt} 명 참여 중
                                    </p>
                                </CardContent>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            {/* 필터 폼 */}
            <Card className="lg:w-1/4">
                <CardHeader>
                    <CardTitle className="text-lg">필터 설정</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>카테고리</FormLabel>
                                        <FormControl>
                                            <RadioGroup
                                                className="flex flex-col gap-2"
                                                {...field}
                                                onValueChange={field.onChange}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <RadioGroupItem value="" id="all" />
                                                    <label htmlFor="all" className="text-sm">
                                                        전체
                                                    </label>
                                                </div>

                                                {categories.map((category) => (
                                                    <div key={category.value} className="flex items-center gap-2">
                                                        <RadioGroupItem
                                                            value={category.value}
                                                            id={category.value}
                                                        />
                                                        <label htmlFor={category.value} className="text-sm">
                                                            {category.label}
                                                        </label>
                                                    </div>
                                                ))}
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* 검색어 입력 */}
                            <FormField
                                control={form.control}
                                name="searchTerm"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>검색어</FormLabel>
                                        <FormControl>
                                            <Input placeholder="검색어를 입력하세요" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* 시작 날짜 */}
                            <FormField
                                control={form.control}
                                name="startDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>시작 날짜</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* 종료 날짜 */}
                            <FormField
                                control={form.control}
                                name="endDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>종료 날짜</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit">검색</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};

export default MeetingListPage;
