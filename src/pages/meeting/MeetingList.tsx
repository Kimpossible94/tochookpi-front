import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button} from "@/components/ui/shadcn/button";
import {Input} from "@/components/ui/shadcn/input";
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/shadcn/popover";
import {Calendar, ChevronDown, Filter, MapPin, Search, X} from "lucide-react";
import defaultImage from "@/assets/undraw_conversation_15p8.svg";
import {
    Meeting,
    MEETING_CATEGORIES,
    MEETING_CATEGORY_LABELS,
    MEETING_SORT_OPTION_LABELS,
    MEETING_SORT_OPTIONS,
    MeetingCategory,
    MeetingSortOption
} from "@/redux/types/meeting";
import api from "@/services/api";
import {Badge} from "@/components/ui/shadcn/badge";
import {Link, useSearchParams} from "react-router-dom";
import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/shadcn/dialog";
import MeetingDetail from "./MeetingDetail";
import {meetingFilterSchema} from "@/lib/schemas/meeting";
import UserBadge from "@/components/ui/user/userBadge";

const FilterSchema = meetingFilterSchema;

type FilterFormType = z.infer<typeof FilterSchema>;

const MeetingListPage: React.FC = () => {
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [sortPopoverOpen, setSortPopoverOpen] = useState<boolean>(false);
    const [searchParams] = useSearchParams();

    const form = useForm<FilterFormType>({
        resolver: zodResolver(FilterSchema),
        defaultValues: {
            searchTerm: searchParams.get("searchTerm") ?? "",
            category: [],
            sortOption: "LATEST",
        },
    });

    const fetchMeetings = async (filters?: FilterFormType) => {
        try {
            setLoading(true);
            let query = "";
            if (filters) {
                const params = new URLSearchParams();
                if (filters.searchTerm) params.append("searchTerm", filters.searchTerm);
                if (filters.category && filters.category.length > 0) {
                    filters.category.forEach((cat: MeetingCategory) => params.append("category", cat));
                }
                if (filters.sortOption) params.append("sort", filters.sortOption);
                query = "?" + params.toString();
            }

            const response = await api.get(`/meetings${query}`);
            setMeetings(response.data);
        } catch (error) {
            console.error("모임 데이터를 불러오는 중 오류 발생:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMeetings(form.getValues());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onSubmit = (data: FilterFormType) => {
        fetchMeetings(data);
    };

    const handleCategorySelect = (category: MeetingCategory) => {
        const current = form.getValues("category") || [];
        const isAlreadySelected = current.includes(category);

        const newCategories = isAlreadySelected
            ? current // 이미 있으면 기존 목록 반환
            : [...current, category]; // 기존 목록에 없으면 추가

        form.setValue("category", newCategories);
    };

    const handleCategoryDelete = (category: MeetingCategory) => {
        const current: MeetingCategory[] = form.getValues("category") || [];
        const newCategories = current.filter((cat: MeetingCategory) => cat !== category);
        form.setValue("category", newCategories);
    };

    const handleSortChange = (sort: MeetingSortOption) => {
        form.setValue("sortOption", sort);
        setSortPopoverOpen(false);
    };

    return (
        <div className="flex flex-col w-full px-20 pt-4 pb-16">
            {form.getValues("searchTerm") && (
                <div className="w-full py-10">
                    <p className="font-bold text-4xl text-center">{form.getValues("searchTerm")}</p>
                    <p className="text-center text-gray-500 mt-1">에 대한 검색결과입니다.</p>
                </div>
            )}

            <div className="flex gap-2 mb-4">
                {form.watch("category")?.map((c: MeetingCategory) => (
                    <Badge
                        key={c}
                        variant="secondary"
                        className="flex items-center gap-1 px-3 py-1 rounded-full"
                    >
                        {MEETING_CATEGORY_LABELS[c]}
                        <button type="button" onClick={() => handleCategoryDelete(c)}>
                            <X className="w-3 h-3 ml-1 hover:text-red-500"/>
                        </button>
                    </Badge>
                ))}
            </div>

            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex items-center mb-6 w-full gap-6 justify-between"
            >
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="flex items-center gap-2">
                            카테고리 <ChevronDown size={16}/>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-36 max-h-36 overflow-y-auto">
                        <div className="flex flex-col space-y-2">
                            {MEETING_CATEGORIES.map((c: MeetingCategory) => (
                                <Button
                                    key={c}
                                    variant="ghost"
                                    className="justify-start"
                                    onClick={() => handleCategorySelect(c)}
                                >
                                    {MEETING_CATEGORY_LABELS[c]}
                                </Button>
                            ))}
                        </div>
                    </PopoverContent>
                </Popover>

                <div className="relative w-full pl-4">
                    <Input
                        type="text"
                        placeholder="모임 검색"
                        {...form.register("searchTerm")}
                        className="flex-1"
                    />
                    <button
                        type="submit"
                        className="absolute right-1 top-1/2 -translate-y-1/2 pr-2 py-1 text-sm hover:text-gray-400 focus:outline-none"
                    >
                        <Search/>
                    </button>
                </div>

                <Popover open={sortPopoverOpen} onOpenChange={setSortPopoverOpen}>
                    <PopoverTrigger asChild onClick={() => setSortPopoverOpen(true)}>
                        <Button variant="outline" className="flex items-center gap-2">
                            <Filter size={16}/> {MEETING_SORT_OPTION_LABELS[form.getValues("sortOption") ?? "LATEST"]}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-40">
                        <div className="flex flex-col space-y-2">
                            {MEETING_SORT_OPTIONS.map((option: MeetingSortOption) => (
                                <Button
                                    key={option}
                                    variant="ghost"
                                    className="justify-start"
                                    onClick={() => handleSortChange(option)}
                                >
                                    {MEETING_SORT_OPTION_LABELS[option]}
                                </Button>
                            ))}
                        </div>
                    </PopoverContent>
                </Popover>
            </form>

            <div>
                {loading ? (
                    <p className="text-center text-gray-400">로딩 중...</p>
                ) : meetings.length === 0 ? (
                    <p className="text-center text-gray-400">모임이 없습니다.</p>
                ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {meetings.map((meeting) => (
                            <div key={meeting.id} className="flex flex-col gap-2">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <div
                                            className="relative flex rounded-2xl shadow hover:shadow-lg hover:border
                                                        transition overflow-hidden">
                                            <div className="w-40 aspect-square overflow-hidden flex items-center justify-center">
                                                <img
                                                    src={meeting.image || defaultImage}
                                                    alt=""
                                                    className="w-3/4 h-3/4 object-contain rounded-full"
                                                    onError={(e) => {
                                                        e.currentTarget.src = defaultImage;
                                                    }}
                                                />
                                            </div>

                                            <div className="flex flex-col p-3 justify-center flex-1 pr-5">
                                                <div className="flex justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <span
                                                            className={`w-2.5 h-2.5 rounded-full ${
                                                                meeting.status === "ONGOING"
                                                                    ? "bg-green-500"
                                                                    : meeting.status === "ENDED"
                                                                        ? "bg-gray-400"
                                                                        : "bg-blue-400"
                                                            }`}
                                                        />
                                                        <span className="text-xs">
                                                            {meeting.status === "ONGOING"
                                                                ? "진행중"
                                                                : meeting.status === "ENDED"
                                                                    ? "종료됨"
                                                                    : "진행 예정"}
                                                          </span>
                                                        <span className="text-xs text-gray-400">•</span>
                                                        <span className="text-xs">
                                                            {MEETING_CATEGORY_LABELS[meeting.category]}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center text-xs font-semibold">
                                                        <UserBadge
                                                            user={meeting.organizer}
                                                            sizeClass="w-5 h-5"
                                                            organizer={true}
                                                            shadow={false}
                                                        />
                                                    </div>
                                                </div>

                                                <p className="text-xl font-bold mt-1 line-clamp-2 break-all">
                                                    {meeting.title}
                                                </p>

                                                <div className="text-xs text-gray-500 mt-2 flex gap-3">
                                                    <span className="flex gap-1">
                                                        <Calendar className="w-4 h-4" />
                                                        {meeting.startDate} ~ {meeting.endDate}
                                                    </span>
                                                    {meeting.location && (
                                                        <span className="flex gap-1">
                                                            <MapPin className="w-4 h-4"/>
                                                            {meeting.location.title.replace(/<[^>]*>?/gm, "")}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </DialogTrigger>
                                    <DialogContent
                                        className="max-w-full max-h-full w-full h-full sm:max-h-[90%] sm:h-[90%] min-h-0 p-0">
                                        <MeetingDetail meetingId={meeting.id}/>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Link to="/create-meeting" className="fixed right-20 bottom-10">
                <button
                    className="py-2 px-4 text-md text-white bg-pink-400 hover:bg-pink-300 rounded-3xl
                                hover:opacity-80 focus:outline-none shadow-xl"
                >
                    모임 만들기
                </button>
            </Link>
        </div>
    );
};

export default MeetingListPage;

//TODO: 모임삭제 후 리스트 초기화 구현