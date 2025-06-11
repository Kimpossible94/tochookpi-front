import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover";
import {ChevronDown, Filter, Search, Users, X} from "lucide-react";
import defaultImage from "../assets/undraw_conversation_15p8.svg";
import {Avatar, AvatarImage} from "@/components/ui/avatar";
import {Meeting} from "@/redux/types/meeting";
import api from "@/services/api";
import {Badge} from "@/components/ui/badge";
import {useSearchParams} from "react-router-dom";

const FilterSchema = z.object({
    searchTerm: z.string().optional(),
    category: z.array(z.string()).optional(),
    sortOption: z.enum(["최신순", "인기순"]).optional(),
});

type FilterFormType = z.infer<typeof FilterSchema>;

const categories = ["스터디", "운동", "취미", "여행", "음악"];
const sortOptions = ["최신순", "인기순"];

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
            sortOption: "최신순",
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
                    filters.category.forEach(cat => params.append("category", cat));
                }
                if (filters.sortOption) {
                    const sortMap: Record<string, string> = {
                        최신순: "latest",
                        인기순: "popular",
                    };
                    params.append("sort", sortMap[filters.sortOption]);
                }
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
    }, []);

    const onSubmit = (data: FilterFormType) => {
        fetchMeetings(data);
    }

    const handleCategorySelect = (category: string) => {
        const current = form.getValues("category") || [];
        const isAlreadySelected = current.includes(category);

        const newCategories = isAlreadySelected
            ? current // 이미 있으면 기존 목록 반환
            : [...current, category]; // 기존 목록에 없으면 추가

        form.setValue("category", newCategories);
    };

    const handleCategoryDelete = (category: string) => {
        const current = form.getValues("category") || [];
        const newCategories = current.filter((cat) => cat !== category);
        form.setValue("category", newCategories);
    }

    const handleSortChange = (sort: FilterFormType["sortOption"]) => {
        form.setValue("sortOption", sort);
        setSortPopoverOpen(false);
    };

    return (
        <div className="flex flex-col w-full px-20 pt-4 pb-16">
            {form.getValues("searchTerm") && (
                <div className="w-full py-10">
                    <p className="font-bold text-4xl text-center">
                        {form.getValues("searchTerm")}
                    </p>
                    <p className="text-center text-gray-500 mt-1">에 대한 검색결과입니다.</p>
                </div>
            )}

            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex items-center mb-6 w-full gap-6 justify-between"
            >
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="flex items-center gap-2">
                            카테고리 <ChevronDown size={16} />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-36 max-h-36 overflow-y-auto">
                        <div className="flex flex-col space-y-2">
                            {categories.map((cat) => (
                                <Button
                                    key={cat}
                                    variant="ghost"
                                    className="justify-start"
                                    onClick={() => handleCategorySelect(cat)}
                                >
                                    {cat}
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
                        <Search />
                    </button>
                </div>

                <Popover open={sortPopoverOpen} onOpenChange={setSortPopoverOpen}>
                    <PopoverTrigger asChild onClick={() => setSortPopoverOpen(true)}>
                        <Button variant="outline" className="flex items-center gap-2">
                            <Filter size={16} /> {form.getValues("sortOption")}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-40">
                        <div className="flex flex-col space-y-2">
                            {sortOptions.map((option) => (
                                <Button
                                    key={option}
                                    variant="ghost"
                                    className="justify-start"
                                    onClick={() => handleSortChange(option as "최신순" | "인기순")}
                                >
                                    {option}
                                </Button>
                            ))}
                        </div>
                    </PopoverContent>
                </Popover>
            </form>

            <div className="flex gap-2 flex-wrap mb-4">
                {form.watch("category")?.map((c) => (
                    <Badge
                        key={c}
                        variant="secondary"
                        className="flex items-center gap-1 px-3 py-1 rounded-full"
                    >
                        {c}
                        <button
                            type="button"
                            onClick={() => handleCategoryDelete(c)}
                        >
                            <X className="w-3 h-3 ml-1 hover:text-red-500" />
                        </button>
                    </Badge>
                ))}
            </div>

            <div>
                {loading ? (
                    <p className="text-center text-gray-400">로딩 중...</p>
                ) : meetings.length === 0 ? (
                    <p className="text-center text-gray-400">모임이 없습니다.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {meetings.map((meeting) => (
                            <div key={meeting.id} className="flex flex-col">
                                <div
                                    className="relative rounded-2xl overflow-hidden shadow hover:shadow-lg transition p-2 bg-gray-50"
                                >
                                    <img
                                        src={meeting.image || defaultImage}
                                        alt=""
                                        className="w-full h-48 object-contain object-center"
                                    />

                                    <div className="absolute left-3 top-2 flex items-center gap-1">
                                        <span
                                            className={`w-2.5 h-2.5 rounded-full
                                            ${meeting.status === "ONGOING" ? "bg-green-500"
                                                : meeting.status === "ENDED" ? "bg-gray-400" : "bg-blue-400"
                                            }`}
                                        />
                                        <span className="text-xs font-medium text-gray-700">
                                            {meeting.status === "ONGOING" ? "진행중"
                                                : meeting.status === "ENDED"? "종료됨" : "예정"}
                                        </span>
                                    </div>

                                    <div className='flex text-sm font-semibold absolute right-3 top-2'>
                                        <Avatar className="w-5 h-5">
                                            <AvatarImage
                                                src={
                                                    meeting.organizer?.profileImage ||
                                                    "https://github.com/shadcn.png"
                                                }
                                            />
                                        </Avatar>
                                        <span className="ml-1">{meeting.organizer?.username}</span>
                                    </div>
                                </div>
                                <div className="mt-3 text-sm flex justify-between font-semibold">
                                    <p className="truncate text-base content-center">
                                        {meeting.title}
                                    </p>
                                    <p className="text-gray-500 mt-1">
                                        {meeting.period?.startDate}
                                    </p>
                                    <p className="text-gray-600 mt-1 flex items-center">
                                        <Users className="w-4 h-4 mr-2" />
                                        <span>{meeting.currentParticipantsCnt} / {meeting.maxParticipantsCnt}</span>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MeetingListPage;
