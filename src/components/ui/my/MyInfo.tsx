import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const MyInfo = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold">내 정보 수정</h1>
            <div>
                <label className="block text-sm font-medium text-gray-700">이름</label>
                <Input placeholder="이름을 입력하세요" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">프로필 사진</label>
                <input type="file" className="block w-full text-sm text-gray-900 border border-gray-300 rounded-md" />
            </div>
            <Button className="mt-4">저장</Button>
        </div>
    );
};
