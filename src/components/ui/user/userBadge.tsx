import {UserInfo} from "@/redux/types/user";
import {Avatar, AvatarImage} from "@/components/ui/shadcn/avatar";
import React from "react";
import {Crown} from "lucide-react";

const UserBadge = ({ user, sizeClass, organizer, shadow, onClick }:
                   { user: UserInfo; sizeClass: string; organizer: boolean; shadow: boolean; onClick?: () => void }) => (
    <div className={`${shadow ? 'shadow-md border rounded-full': ''} 
                    flex items-center font-medium font-md p-1 pr-2 border-gray-200 h-fit hover:opacity-70`}
        onClick={onClick}>
        <Avatar className={sizeClass}>
            <AvatarImage
                src={
                    user.profileImage || "https://github.com/shadcn.png"
                }
            />
        </Avatar>
        <span className="ml-2">{user.username}</span>
        {organizer && (<Crown className="w-4 h-4 ml-1 self-center text-yellow-500"/>)}
    </div>
);

export default UserBadge;

