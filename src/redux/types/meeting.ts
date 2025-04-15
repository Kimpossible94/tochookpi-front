import {UserInfo} from "@/redux/types/user";
export interface MeetingSchedule {
    date: string; // YYYY-MM-DD
    events: {
        startTime: string; // "HH:mm" 형식
        endTime: string; // "HH:mm" 형식
        description: string;
    }[];
}

export interface MeetingReview {
    images: string[];
    comments: string;
}

export type MeetingStatus = "BEFORE" | "ONGOING" | "ENDED";

export interface Meeting {
    id: number;
    title: string;
    description: string;
    location?: {
        title: string,
        address: string,
        lng: number,
        lat: number,
    };
    image?: string;
    currentParticipantsCnt: number;
    maxParticipantsCnt: number;
    participants: UserInfo[];
    period: { startDate: string; endDate: string };
    schedules: MeetingSchedule[];
    status: MeetingStatus;
    review?: MeetingReview[];
}
