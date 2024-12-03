import React from "react";

interface SidebarMenuProps {
    selectedMenu: string;
    selectedSubMenu: string;
    setSelectedMenu: (menu: string) => void;
    setSelectedSubMenu: (subMenu: string) => void;
    menuItems: { name: string; value: string; subMenu?: { name: string; value: string }[] }[]; // 서브 메뉴 포함 가능
    bottomItems?: { name: string; value: string }[]; // 하단에 추가될 항목들 (회원탈퇴 같은)
}

const SidebarMenu = ({
                         selectedMenu,
                         selectedSubMenu,
                         setSelectedMenu,
                         setSelectedSubMenu,
                         menuItems,
                         bottomItems,
                     }: SidebarMenuProps) => {
    return (
        <div className="w-1/5 p-4 text-sm">
            <ul className="space-y-1">
                {menuItems.map((item) => (
                    <li key={item.value}>
                        <div
                            onClick={() => {
                                setSelectedMenu(item.value);
                                // 서브 메뉴가 있을 경우 첫 번째 서브 메뉴를 선택
                                if (item.subMenu && item.subMenu.length > 0) {
                                    setSelectedSubMenu(item.subMenu[0].value);
                                }
                            }}
                            className={`cursor-pointer py-2 px-3 rounded-2xl ${
                                selectedMenu === item.value ? "bg-gray-200 font-bold" : ""
                            }`}
                        >
                            {item.name}
                        </div>
                        {/* 서브 메뉴가 있을 경우 */}
                        {selectedMenu === item.value && item.subMenu && (
                            <ul className="ml-4 my-2 space-y-2">
                                {item.subMenu.map((subItem) => (
                                    <li
                                        key={subItem.value}
                                        onClick={() => setSelectedSubMenu(subItem.value)}
                                        className={`cursor-pointer ${
                                            selectedSubMenu === subItem.value ? "text-blue-500" : ""
                                        }`}
                                    >
                                        {subItem.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
                <hr />
                {/* 하단 항목들 */}
                {bottomItems && bottomItems.map((item) => (
                    <li
                        key={item.value}
                        onClick={() => setSelectedMenu(item.value)}
                        className={`cursor-pointer py-2 px-3 text-red-500 ${
                            selectedMenu === item.value ? "font-bold" : ""
                        }`}
                    >
                        {item.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SidebarMenu;
