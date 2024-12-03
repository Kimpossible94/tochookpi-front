// Header.tsx
import * as React from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "../ui/navigation-menu";
import { cn } from "@/lib/utils";
import {BellIcon} from "@radix-ui/react-icons";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";

const components: { title: string; href: string; description: string }[] = [
    {
        title: "모임 목록",
        href: "/docs/primitives/alert-dialog",
        description: "원하는 모임을 조회하거나 만들어봐요.",
    },
    {
        title: "나의 모임",
        href: "/docs/primitives/hover-card",
        description: "내가 만든 모임을 관리해요.",
    },
];

const Header = () => {
    const [hasNotification, setHasNotification] = React.useState(true);
    const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);
    const notifications = [
        "새로운 사람이 모임에 참여했습니다!",
        "모임에 새로운 댓글이 달렸습니다!",
        "모임에 새로운 댓글이 달렸습니다!",
        "모임에 새로운 댓글이 달렸습니다!",
        "모임에 새로운 댓글이 달렸습니다!",
        "모임에 새로운 댓글이 달렸습니다!",
        "모임에 새로운 댓글이 달렸습니다!",
        "모임에 새로운 댓글이 달렸습니다!",
        "모임에 새로운 댓글이 달렸습니다!",
        "모임에 새로운 댓글이 달렸습니다!",
        "모임에 새로운 댓글이 달렸습니다!",
        "모임에 새로운 댓글이 달렸습니다!",
        "모임에 새로운 댓글이 달렸습니다!",
        "모임에 새로운 댓글이 달렸습니다!",
        "모임에 새로운 댓글이 달렸습니다!",
        // 다른 알림 내용들...
    ];

    const toggleNotifications = () => {
        setIsNotificationsOpen(!isNotificationsOpen); // 알림 상태 토글 (예: 클릭 시)
    };

    return (
        <header className="p-4 flex items-center justify-between fixed top-0 w-full bg-white z-50">
            {/* 로고 (왼쪽) */}
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

                {/* 알림 아이콘 (알림이 있을 경우 배지 표시) */}
                <TooltipProvider delayDuration={0}>
                    <Tooltip>
                        <TooltipTrigger className="flex items-center justify-center p-2 text-gray-600">
                            <BellIcon></BellIcon>
                        </TooltipTrigger>
                        <TooltipContent className="w-60 p-2 bg-white shadow-md rounded-md">
                            <ul>
                                {notifications.length > 0 ? (
                                    notifications.map((notification, index) => (
                                        <li
                                            key={index}
                                            className="text-sm text-gray-700 p-2 hover:bg-gray-100 rounded-md"
                                        >
                                            {notification}
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-sm text-gray-500 p-2">새로운 알림이 없습니다.</li>
                                )}
                            </ul>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                {/* 사용자 아바타 */}
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
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
