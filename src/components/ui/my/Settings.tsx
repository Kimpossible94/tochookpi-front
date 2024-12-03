import { Switch } from "@/components/ui/switch";

export const Settings = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold">기본 설정</h1>
            <div className="flex items-center space-x-4">
                <label className="text-sm">모임 초대 거부</label>
                <Switch />
            </div>
            <div className="flex items-center space-x-4">
                <label className="text-sm">알림 거부</label>
                <Switch />
            </div>
        </div>
    );
};
