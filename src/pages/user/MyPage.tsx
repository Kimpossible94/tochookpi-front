import React, {useState} from "react";
import SidebarMenu from "@/components/ui/shadcn/SidebarMenu";
import {MyInfo} from "@/components/ui/my/MyInfo";
import {Settings} from "@/components/ui/my/Settings";
import {Avatar, AvatarImage} from "@/components/ui/shadcn/avatar";
import {useSelector} from "react-redux";
import {RootState} from "@/redux/store";
import {DeleteAccount} from "@/components/ui/my/DeleteAccount";

const MyPage = () => {
    const [selectedMenu, setSelectedMenu] = useState("내정보수정");
    const [selectedSubMenu, setSelectedSubMenu] = useState("내가만든모임");
    const { user } = useSelector((state: RootState) => state.user);

    const renderContent = () => {
        switch (selectedMenu) {
            case "내정보수정":
                return <MyInfo/>;
            // case "모임":
            //     return <MyMeetings subMenu={selectedSubMenu} />;
            case "기본설정":
                return <Settings />;
            case "회원탈퇴":
                return <DeleteAccount />;
            default:
                return null;
        }
    };

    const menuItems = [
        { name: "내정보수정", value: "내정보수정" },
        // {
        //     name: "모임",
        //     value: "모임",
        //     subMenu: [
        //         { name: "내가 만든 모임", value: "내가만든모임" },
        //         { name: "내가 참여한 모임", value: "내가참여한모임" },
        //     ],
        // },
        { name: "기본설정", value: "기본설정" },
    ];

    const bottomItems = [
        { name: "회원탈퇴", value: "회원탈퇴" },
    ];

    return (
        <div className="flex flex-col min-h-screen px-32">
            <div className="px-10 pt-10">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-4">
                        <Avatar className="w-24 h-24">
                            <AvatarImage src={user?.profileImage || 'https://github.com/shadcn.png'}/>
                        </Avatar>
                        <div>
                            <h1 className="text-2xl font-semibold">{user?.username} / {selectedMenu}</h1>
                            <p className="text-gray-500 truncate">{user?.bio}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex">
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
        </div>
    );
};

export default MyPage;
