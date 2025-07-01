export interface UserInfo {
    id: number;
    username: string;
    email: string;
    profileImage: string;
    bio: string;
    address: string;
    userSetting: UserSetting | null;
}

export interface UserSetting {
    isInviteDisabled: boolean;
    isNotificationDisabled: boolean;
}
