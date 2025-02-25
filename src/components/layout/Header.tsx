import * as React from "react";
import {Link} from "react-router-dom";
import {Avatar, AvatarImage} from "../ui/avatar";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "../ui/navigation-menu";
import {cn} from "@/lib/utils";
import {BellIcon} from "@radix-ui/react-icons";

const components: { title: string; href: string; description: string }[] = [
    {
        title: "모임 목록",
        href: "/meeting-list",
        description: "원하는 모임을 조회하거나 만들어봐요.",
    },
    {
        title: "나의 모임",
        href: "/docs/primitives/hover-card",
        description: "내가 만든 모임을 관리해요.",
    },
];

const Header = () => {
    const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);

    // 현재 시간을 기준으로 시간 차이 계산 함수
    const calculateTimeDifference = (timestamp: Date) => {
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - timestamp.getTime()) / 1000);

        if (diffInSeconds < 60) return "방금";
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}시간 전`;
        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays}일 전`;
    };

    const notifications = [
        { groupName: "산책모임", message: "에서 초대가 왔습니다.", timestamp: new Date(new Date().getTime() - 1000) },
        { groupName: "스터디모임", message: " 새로운 멤버가 들어왔습니다.", timestamp: new Date(new Date().getTime() - 5 * 60 * 1000) },
        { groupName: "독서모임", message: " 새로운 공지사항이 있습니다.", timestamp: new Date(new Date().getTime() - 2 * 60 * 60 * 1000) },
        { groupName: "헬스모임", message: "에서 초대가 왔습니다.", timestamp: new Date(new Date().getTime() - 26 * 60 * 60 * 1000) },
        { groupName: "코딩모임", message: " 새로운 공지사항이 있습니다.", timestamp: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000) },
        { groupName: "산책모임", message: "에서 초대가 왔습니다.", timestamp: new Date(new Date().getTime() - 1000) },
        { groupName: "스터디모임", message: " 새로운 멤버가 들어왔습니다.", timestamp: new Date(new Date().getTime() - 5 * 60 * 1000) },
        { groupName: "독서모임", message: " 새로운 공지사항이 있습니다.", timestamp: new Date(new Date().getTime() - 2 * 60 * 60 * 1000) },
        { groupName: "헬스모임", message: "에서 초대가 왔습니다.", timestamp: new Date(new Date().getTime() - 26 * 60 * 60 * 1000) },
        { groupName: "코딩모임", message: " 새로운 공지사항이 있습니다.", timestamp: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000) },
    ];

    const hasNotifications = notifications.length > 0;

    const toggleNotifications = () => {
        setIsNotificationsOpen(!isNotificationsOpen);
    };

    return (
        <header className="p-4 flex items-center justify-between fixed top-0 w-full bg-white z-50">
            {/* 로고 */}
            <div className="flex items-center space-x-4 w-full max-w-lg">
                <Link to="/" className="text-lg font-bold whitespace-nowrap font-custom">
                    <p className="text-right">토축피</p>
                    <p className="text-right text-xs bg-black text-white pl-5 pr-1">모여라</p>
                </Link>

                {/* 검색창 */}
                <div className="relative w-full pl-4">
                    <input
                        type="text"
                        placeholder="모임을 검색하세요..."
                        className="w-full py-2 pl-5 text-sm rounded-3xl border border-gray-200 bg-gray-100 focus:outline-none hover:border-red-400 hover:bg-white focus:border-red-400 focus:bg-white duration-150"
                    />
                    <button
                        className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1 text-sm text-white bg-red-400 rounded-3xl hover:opacity-80 focus:outline-none"
                        onClick={() => console.log("검색 버튼 클릭됨")}
                    >
                        검색
                    </button>
                </div>
            </div>

            {/* 메뉴 및 알림 */}
            <div className="flex items-center space-x-4 text-sm">
                <NavigationMenu className="mr-10">
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger>모임</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid w-[100px] gap-3 p-4 md:w-[200px] md:grid-cols-1 lg:w-[300px]">
                                    {components.map((component) => (
                                        <ListItem
                                            key={component.title}
                                            title={component.title}
                                            href={component.href}
                                        >
                                            {component.description}
                                        </ListItem>
                                    ))}
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link to="/docs">
                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                    사용방법
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>

                {/* 알림 아이콘 */}
                <div className="relative">
                    <button
                        onClick={toggleNotifications}
                        className="relative flex items-center justify-center p-2 text-gray-600 focus:outline-none"
                    >
                        <BellIcon />
                        {hasNotifications && (
                            <span className="absolute top-0 right-0 w-4 h-4 text-xs text-white bg-red-500 rounded-full flex items-center justify-center">
                                {notifications.length}
                            </span>
                        )}
                    </button>

                    {isNotificationsOpen && (
                        <div className="absolute right-0 mt-2 w-72 max-h-64 overflow-y-auto p-4 bg-white shadow-md rounded-md z-50">
                            <ul>
                                {notifications.length > 0 ? (
                                    notifications.map((notification, index) => (
                                        <li
                                            key={index}
                                            className="text-sm text-gray-700 py-2 hover:bg-gray-100 rounded-md flex justify-between"
                                        >
                                            <div className="flex-1">
                                                <strong>[{notification.groupName}]</strong> {notification.message}
                                            </div>
                                            <span className="text-xs text-gray-500 w-1/5 text-right">
                                                {calculateTimeDifference(notification.timestamp)}
                                            </span>
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-sm text-gray-500 py-2">새로운 알림이 없습니다.</li>
                                )}
                            </ul>
                        </div>
                    )}
                </div>

                <Link to="/my">
                    <Avatar className="cursor-pointer">
                        <AvatarImage src="https://github.com/shadcn.png" />
                    </Avatar>
                </Link>
            </div>
        </header>
    );
};

const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    );
});
ListItem.displayName = "ListItem";

export default Header;
