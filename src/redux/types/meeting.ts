import {UserInfo} from "@/redux/types/user";
export interface MeetingSchedule {
    date: string; // YYYY-MM-DD
    events: {
        startTime: string; // "HH:mm"
        endTime: string; // "HH:mm"
        description: string;
    }[];
}

export interface MeetingLocation {
    title: string; // 주소지 이름
    address: string; // 주소
    lng: number; // 경도
    lat: number; // 위도
}

export interface MeetingReview {
    images: string[];
    comments: string;
}

export type MeetingStatus = "BEFORE" | "ONGOING" | "ENDED";

export interface Meeting {
    id: number;
    title: string;
    description?: string;
    organizer: UserInfo;
    location?: MeetingLocation;
    image?: string;
    currentParticipantsCnt: number;
    maxParticipantsCnt: number;
    participants: UserInfo[];
    period: { startDate: string; endDate: string };
    schedules?: MeetingSchedule[];
    status: MeetingStatus;
    review?: MeetingReview[];
}
