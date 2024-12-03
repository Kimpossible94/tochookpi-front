import React, { useState } from "react";
import SidebarMenu from "@/components/ui/SidebarMenu";
import { MyInfo } from "@/components/ui/my/MyInfo";
import MyMeetings from "@/components/ui/my/MyMeetings";
import { Settings } from "@/components/ui/my/Settings";

const MyPage = () => {
    const [selectedMenu, setSelectedMenu] = useState("내정보수정");
    const [selectedSubMenu, setSelectedSubMenu] = useState("내가만든모임");

    const renderContent = () => {
        switch (selectedMenu) {
            case "내정보수정":
                return <MyInfo />;
            case "모임":
                return <MyMeetings subMenu={selectedSubMenu} />;
            case "기본설정":
                return <Settings />;
            case "회원탈퇴":
                return <div>회원탈퇴 페이지</div>;
            default:
                return null;
        }
    };

    const menuItems = [
        { name: "내정보수정", value: "내정보수정" },
        {
            name: "모임",
            value: "모임",
            subMenu: [
                { name: "내가 만든 모임", value: "내가만든모임" },
                { name: "내가 참여한 모임", value: "내가참여한모임" },
            ],
        },
        { name: "기본설정", value: "기본설정" },
    ];

    // 하단에 표시할 항목들 (회원탈퇴)
    const bottomItems = [
        { name: "회원탈퇴", value: "회원탈퇴" },
    ];

    return (
        <div className="flex min-h-screen pt-20 px-10">
            <SidebarMenu
                selectedMenu={selectedMenu}
                selectedSubMenu={selectedSubMenu}
                setSelectedMenu={setSelectedMenu}
                setSelectedSubMenu={setSelectedSubMenu}
                menuItems={menuItems}
                bottomItems={bottomItems}
            />
            <div className="flex-1 p-4 border-none">{renderContent()}</div>
        </div>
    );
};

export default MyPage;