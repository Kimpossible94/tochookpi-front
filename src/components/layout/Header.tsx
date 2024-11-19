import {FC} from "react";
import {Link} from "react-router-dom";
import logo from "@/assets/logo.svg"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger
} from "../ui/navigation-menu";

const Header: FC = () => {
    return (
        <header className="bg-gray-800 text-white p-4 flex items-center justify-between">
            {/* 로고 (왼쪽) */}
            <div className="flex items-center space-x-4">
                <Link to="/">
                    <img src={logo} alt="Logo" className="h-8" />
                </Link>

                {/* 검색창 */}
                <input
                    type="text"
                    placeholder="모임을 검색하세요..."
                    className="p-2 rounded-lg border border-gray-600 bg-gray-700 text-white focus:outline-none"
                />
            </div>

            {/* 네비게이션 (중앙) */}
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <NavigationMenuLink>Link</NavigationMenuLink>
                            <NavigationMenuLink>Link</NavigationMenuLink>
                            <NavigationMenuLink>Link</NavigationMenuLink>
                            <NavigationMenuLink>Link</NavigationMenuLink>
                            <NavigationMenuLink>Link</NavigationMenuLink>
                            <NavigationMenuLink>Link</NavigationMenuLink>
                            <NavigationMenuLink>Link</NavigationMenuLink>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>

            {/* 사용자 이름과 프로필 사진 (오른쪽) */}
            <div className="flex items-center space-x-4">
                <span>사용자 이름</span>
                <img
                    src="/path/to/user-profile.jpg" // 프로필 사진 경로
                    alt="User Profile"
                    className="w-10 h-10 rounded-full"
                />
            </div>
        </header>
    );
};

export default Header;
