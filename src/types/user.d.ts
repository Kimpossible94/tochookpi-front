export interface UserInfo {
    id: number;
    username: string;
    email: string;
    profileImage: string;
    bio: string;
    address: string;
    role: "USER" | "ADMIN";
}
