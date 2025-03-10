export type Participant = string;

export type Meeting = {
    id: string;
    image: string;
    title: string;
    description: string;
    currentParticipantsCnt: number;
    maxParticipantsCnt: number;
    participants: Participant[];
};

export type MeetingSection = {
    subject: string;
    subjectName: string;
    children: Meeting[];
};

export type MeetingsData = MeetingSection[];
