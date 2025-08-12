import React, {useEffect, useState} from "react";
import {Meeting, MEETING_CATEGORIES, MEETING_CATEGORY_LABELS} from "@/redux/types/meeting"
import SidebarMenu from "@/components/ui/shadcn/SidebarMenu";
import {useSearchParams} from "react-router-dom";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import api from "@/services/api";
import {Badge} from "@/components/ui/shadcn/badge";
import {Calendar, ChevronDown, Filter, MapPin, Search, Tags, X} from "lucide-react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/shadcn/popover";
import {Button} from "@/components/ui/shadcn/button";
import {Input} from "@/components/ui/shadcn/input";
import {Dialog, DialogContent, DialogTitle, DialogTrigger} from "@/components/ui/shadcn/dialog";
import defaultImage from "@/assets/undraw_conversation_15p8.svg";
import {Avatar, AvatarImage} from "@/components/ui/shadcn/avatar";
import MeetingDetail from "./MeetingDetail";

const FilterSchema = z.object({
    searchTerm: z.string().optional(),
    category: z.array(z.string()).optional(),
    sortOption: z.enum(["최신순", "인기순"]).optional(),
});

type FilterFormType = z.infer<typeof FilterSchema>;

const sortOptions = ["최신순", "인기순"];

export default function MyMeeting() {
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [sortPopoverOpen, setSortPopoverOpen] = useState<boolean>(false);
    const [openDialogId, setOpenDialogId] = useState<number | null>(null);
    const [searchParams] = useSearchParams();

    const form = useForm<FilterFormType>({
        resolver: zodResolver(FilterSchema),
        defaultValues: {
            searchTerm: searchParams.get("searchTerm") ?? "",
            category: [],
            sortOption: "최신순",
        },
    });

    const [selectedMenu, setSelectedMenu] = useState("created");

    const menuItems = [
        { name: "내가 만든 모임", value: "created" },
        { name: "내가 참여한 모임", value: "joined" },
    ];

    const fetchMeetings = async (filters?: FilterFormType, selectMenu?: string) => {
        try {
            setLoading(true);
            let query = "";
            if (filters) {
                const params = new URLSearchParams();
                if (filters.searchTerm) params.append("searchTerm", filters.searchTerm);
                if (filters.category && filters.category.length > 0) {
                    filters.category.forEach((cat) => params.append("category", cat));
                }
                if (filters.sortOption) {
                    const sortMap: Record<string, string> = {
                        최신순: "latest",
                        인기순: "popular",
                    };
                    params.append("sort", sortMap[filters.sortOption]);
                }
                if(selectMenu) params.append("type", selectMenu);
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
        form.reset();
        fetchMeetings(form.getValues(), selectedMenu);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedMenu]);

    const onSubmit = (data: FilterFormType) => {
        fetchMeetings(data, selectedMenu);
    };

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
    };

    const handleSortChange = (sort: FilterFormType["sortOption"]) => {
        form.setValue("sortOption", sort);
        setSortPopoverOpen(false);
    };

    return (
        <div className="flex flex-col min-h-screen px-32">
            <div className="px-10 pt-10">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-4">
                        <div>
                            <h1 className="text-2xl font-semibold">나의 모임 관리 / {
                                    menuItems.find((menu) => menu.value === selectedMenu)?.name
                                }
                            </h1>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex">
                <SidebarMenu
                    selectedMenu={selectedMenu}
                    setSelectedMenu={setSelectedMenu}
                    menuItems={menuItems}
                />
                <div className="flex-1 p-4 border-none">
                    <div className="flex gap-2 mb-4">
                        {form.watch("category")?.map((c) => (
                            <Badge
                                key={c}
                                variant="secondary"
                                className="flex items-center gap-1 px-3 py-1 rounded-full"
                            >
                                {MEETING_CATEGORY_LABELS[c as keyof typeof MEETING_CATEGORY_LABELS]}
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
                                    {MEETING_CATEGORIES.map((cat) => (
                                        <Button
                                            key={cat}
                                            variant="ghost"
                                            className="justify-start"
                                            onClick={() => handleCategorySelect(cat)}
                                        >
                                            {MEETING_CATEGORY_LABELS[cat]}
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
                                    <Filter size={16}/> {form.getValues("sortOption")}
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

                    <div>
                        {loading ? (
                            <p className="text-center text-gray-400">로딩 중...</p>
                        ) : meetings.length === 0 ? (
                            <p className="text-center text-gray-400">모임이 없습니다.</p>
                        ) : (
                            <div className="grid grid-cols-1 xl:grid-cols-4">
                                {meetings.map((meeting) => (
                                    <div key={meeting.id} className="flex flex-col gap-1 mt-4">
                                        <Dialog
                                            open={openDialogId === meeting.id}
                                            onOpenChange={(open) => setOpenDialogId(open ? meeting.id : null)}
                                        >
                                            <DialogTrigger asChild>
                                                <div className="relative flex-col shadow hover:shadow-lg w-52
                                                                hover:border transition p-2">
                                                    <div className="relative aspect-square shadow-md">
                                                        <img
                                                            src={meeting.image || defaultImage}
                                                            alt=""
                                                            className="h-full"
                                                            onError={(e) => {
                                                                e.currentTarget.src = defaultImage;
                                                            }}
                                                        />

                                                        <span className={`py-1 px-2 right-1 top-1 rounded-full text-white
                                                                            absolute text-[9px] font-bold
                                                                        ${meeting.status === "ONGOING" ? "bg-green-500"
                                                                        : meeting.status === "ENDED" ? "bg-gray-400"
                                                                        : "bg-blue-400"}`}>
                                                            {meeting.status === "ONGOING" ? "진행중"
                                                                : meeting.status === "ENDED" ? "종료됨" : "진행 예정"}
                                                        </span>
                                                    </div>

                                                    <p className="text-base font-bold mt-3 line-clamp-1 break-all">
                                                        {meeting.title}
                                                    </p>

                                                    <span className="flex text-[9px] text-gray-500 mt-1">
                                                        <Calendar className="w-3 h-3 mr-1" />
                                                        {meeting.startDate} ~ {meeting.endDate}
                                                    </span>

                                                    <div className="flex flex-col mt-3 w-full">
                                                        <div className="flex justify-between text-[10px] items-center">
                                                            <span className="flex items-center">
                                                                <Tags className="w-3 h-3 mr-1" />
                                                                {MEETING_CATEGORY_LABELS[meeting.category]}
                                                            </span>
                                                            <div className="flex items-center">
                                                                <Avatar className="w-4 h-4">
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

                                                        {meeting.location && (
                                                            <div className="text-[10px] mt-2">
                                                                <span className="flex items-center">
                                                                    <MapPin className="w-3 h-3 mr-1"/>
                                                                    {meeting.location.title.replace(/<[^>]*>?/gm, "")}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </DialogTrigger>
                                            <DialogContent
                                                className="max-w-full max-h-full w-full h-full sm:max-h-[90%] sm:h-[90%] min-h-0 p-0">
                                                <DialogTitle />
                                                <MeetingDetail
                                                    meetingId={meeting.id}
                                                    onClosed={() => setOpenDialogId(null)}
                                                />
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
