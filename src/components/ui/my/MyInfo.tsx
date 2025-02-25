import * as React from "react";
import {Button} from "@/components/ui/button";
import {UserInfo} from "@/types/user";
import {Textarea} from "@/components/ui/textarea";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Avatar, AvatarImage} from "@/components/ui/avatar";

type MyInfoProps = {
    userInfo?: UserInfo;
};

export const MyInfo = ({ userInfo }: MyInfoProps) => {
    const [bio, setBio] = React.useState(userInfo?.bio || "");
    const MAX_CHAR = 500;

    const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newText = e.target.value;
        if (newText.length <= MAX_CHAR) {
            setBio(newText);
        }
    };

    return (
        <div className="flex space-x-10">
            <div className="w-full">
                <div className="flex items-center space-x-4 mb-4">
                    <Avatar className="w-20 h-20">
                        <AvatarImage src={userInfo?.profileImage || 'https://github.com/shadcn.png'} />
                    </Avatar>
                    <Button variant="outline">새로운 사진 업로드</Button>
                    <Button className="bg-red-500 hover:bg-red-700" variant="destructive">삭제</Button>
                </div>

                <div className="space-y-4">
                    <div>
                        <Label className="block text-base font-semibold mb-2">이름</Label>
                        <Input type="text" className="w-full border rounded-md p-2" value={userInfo?.username} readOnly />
                    </div>
                    <div>
                        <Label className="block text-base font-semibold mb-2">주소</Label>
                        <Input type="text" className="w-full border rounded-md p-2" value={userInfo?.address} readOnly />
                    </div>
                    <div>
                        <div className="flex justify-between">
                            <Label className="block text-base font-semibold mb-2">자기소개</Label>
                            <div className="text-xs text-gray-500 self-center text-right">
                                {bio.length} / {MAX_CHAR}
                            </div>
                        </div>
                        <Textarea
                            className="w-full border rounded-md p-2"
                            rows={4}
                            placeholder="나에 대해서 설명해주세요."
                            value={bio}
                            onChange={handleBioChange}
                        />
                    </div>
                    <div className="flex justify-end mt-4">
                        <Button>저장</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
