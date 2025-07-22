import {z} from "zod";
import {MEETING_CATEGORIES, MEETING_SORT_OPTIONS} from "@/redux/types/meeting";

const meetingScheduleSchema = z.array(
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

const meetingLocationSchema = z.object({
    title: z.string().optional(),
    address: z.string().optional(),
    lng: z.number().optional(),
    lat: z.number().optional(),
})

export const meetingSchema = z.object({
    title: z.string().min(1, "모임 제목을 입력하세요."),
    description: z.string().optional(),
    category: z.string().min(1, "모임 카테고리를 설정해주세요."),
    location: meetingLocationSchema.optional(),
    image: z.instanceof(File).optional(),
    startDate: z.string().min(1, "시작 날짜를 입력하세요."),
    endDate: z.string().min(1, "종료 날짜를 입력하세요."),
    schedules: meetingScheduleSchema.optional(),
    maxParticipantsCnt: z.number().min(1, "최소 1명 이상 설정해야 합니다."),
});

export const meetingFilterSchema = z.object({
    searchTerm: z.string().optional(),
    category: z.array(z.enum(MEETING_CATEGORIES)).optional(),
    sortOption: z.enum(MEETING_SORT_OPTIONS).optional(),
})