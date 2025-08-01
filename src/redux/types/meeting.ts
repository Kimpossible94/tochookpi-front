import {UserInfo} from "@/redux/types/user";

export interface MeetingLocation {
    title: string;    // 주소지 이름
    address: string;  // 주소
    lng: number;      // 경도
    lat: number;      // 위도
}

export interface MeetingReview {
    images: string[];
    comments: string;
    writer: UserInfo;
    createdAt?: string;
}

export type MeetingStatus = "BEFORE" | "ONGOING" | "ENDED";

export const MEETING_CATEGORIES = [
    "REGULAR",
    "MEAL",
    "DRINK",
    "EXERCISE",
    "HOBBY",
    "ETC",
] as const;

export type MeetingCategory = (typeof MEETING_CATEGORIES)[number];

export const MEETING_CATEGORY_LABELS: Record<MeetingCategory, string> = {
    REGULAR: "정기모임",
    MEAL: "식사",
    DRINK: "술",
    EXERCISE: "운동",
    HOBBY: "취미",
    ETC: "기타",
};

export const MEETING_SORT_OPTIONS = [
    "LATEST",
    "POPULAR",
] as const;

export type MeetingSortOption = (typeof MEETING_SORT_OPTIONS)[number];

export const MEETING_SORT_OPTION_LABELS: Record<MeetingSortOption, string> = {
    LATEST: "최신순",
    POPULAR: "인기순",
};

export interface Meeting {
    id: number;
    title: string;
    category: MeetingCategory;
    description?: string;
    organizer: UserInfo;
    location?: MeetingLocation;
    image?: string;
    participants: UserInfo[];
    startDate: string;
    endDate: string;
    status: MeetingStatus;
    review?: MeetingReview[];
    participating?: boolean;
    createdAt?: string;
}
