import {z} from "zod";
import {MEETING_CATEGORIES, MEETING_SORT_OPTIONS} from "@/redux/types/meeting";

const meetingLocationSchema = z.object({
    title: z.string().optional(),
    address: z.string().optional(),
    lng: z.number().optional(),
    lat: z.number().optional(),
})

export const meetingSchema = z.object({
    id: z.number().optional(),
    title: z.string().min(1, "모임 제목을 입력하세요."),
    description: z.string().optional(),
    category: z.string().min(1, "모임 카테고리를 설정해주세요."),
    location: meetingLocationSchema.optional(),
    participants: z.array(z.number()).optional(),
    image: z.instanceof(File).optional(),
    startDate: z.string().min(1, "시작 날짜를 입력하세요."),
    endDate: z.string().min(1, "종료 날짜를 입력하세요."),
});

export const meetingFilterSchema = z.object({
    searchTerm: z.string().optional(),
    category: z.array(z.enum(MEETING_CATEGORIES)).optional(),
    sortOption: z.enum(MEETING_SORT_OPTIONS).optional(),
})

export const meetingReviewSchema = z.object({
    id: z.number().optional(),
    writerId: z.number(),
    meetingId: z.number(),
    comments: z.string().optional(),
    files: z.array(z.instanceof(File)).max(10, '파일은 한 번에 10개까지 업로드 가능합니다.').optional(),
    createdAt: z.string().optional(),
}).refine(data => {
    const hasComment = data.comments && data.comments.trim().length > 0;
    const hasFile = data.files && data.files.length > 0;
    return hasComment || hasFile;
}, {
    message: '한마디 또는 파일첨부중 하나 이상을 입력해주세요.',
    path: ['comments'],
});
