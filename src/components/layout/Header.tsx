import * as React from "react";
import {Link} from "react-router-dom";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle
} from "../ui/navigation-menu";
import {cn} from "@/lib/utils";
import {Avatar, AvatarFallback, AvatarImage} from "../ui/avatar";

const components: { title: string; href: string; description: string }[] = [
    {
        title: "모임 목록",
        href: "/docs/primitives/alert-dialog",
        description:
            "원하는 모임을 조회하거나 만들어봐요.",
    },
    {
        title: "나의 모임",
        href: "/docs/primitives/hover-card",
        description:
            "내가 만든 모임을 관리해요.",
    },
]

const Header = () => {
    return (
        <header className="p-4 flex items-center justify-between fixed top-0 w-full bg-white">
            {/* 로고 (왼쪽) */}
            <div className="flex items-center space-x-4 w-full max-w-lg">
                <Link to="/"
                      className="text-lg font-bold whitespace-nowrap font-custom">
                    <p className="text-right">토축피</p>
                    <p className="text-right text-xs bg-black text-white pl-5 pr-1">모여라</p>
                </Link>

                {/* 검색창 */}
                <div className="relative w-full pl-4">
                    <input
                        type="text"
                        placeholder="모임을 검색하세요..."
                        className="w-full py-2 pl-5 text-sm rounded-3xl border border-gray-200 bg-gray-100 focus:outline-none"
                    />
                    <button
                        className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1 text-sm text-white bg-red-400 rounded-3xl hover:bg-blue-600 focus:outline-none"
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

                <span>김영범</span>
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
    )
})
ListItem.displayName = "ListItem"

export default Header;
