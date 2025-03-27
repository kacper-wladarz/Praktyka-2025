import { useState } from "react";
import { router } from "../App";
import MenuChatIcon from "@assets/MenuChatIcon";
import LogoutIcon from "@assets/LogoutIcon";
import { useAuth } from "@contexts/AuthContext";
import { useTranslation } from "react-i18next";
import DashboardIcon from "@/assets/DashboardIcon";

const Profile = () => {
    const auth = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const [bgImage, setBgImage] = useState(`url('/account.svg')`);
    const { t } = useTranslation();

    const svg = `
        <svg width="24" height="24" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <text
            x="50%" y="50%" font-size="80" font-family="Poppins, sans-serif" font-weight="400" text-anchor="middle" dy=".3em" fill="white">
            ${auth.user?.login.charAt(0).toUpperCase()}
          </text>
        </svg>
      `;

    const encodedSvg = encodeURIComponent(svg);
    const handleMouseEnter = () => {
        setBgImage(`url('data:image/svg+xml;charset=UTF-8,${encodedSvg}')`);
        setIsDropdownOpen(true);
    };

    const handleMouseLeave = () => {
        setBgImage(`url('/account.svg')`);
        setIsDropdownOpen(false);
    };

    const logout = () => {
        auth.logout();
        router.navigate({
            to: "/logout",
            state: { allow: true },
        });
    };

    const handleChatClick = () => {
        setIsDropdownOpen(false);
        router.navigate({ to: "/chat" });
    };

    const handleDashboardClick = () => {
        setIsDropdownOpen(false);
        router.navigate({ to: "/dashboard" });
    };

    const handleLogoutClick = () => {
        setIsDropdownOpen(false);
        logout();
    };

    return (
        <div className="flex items-center">
            <div
                className="bg-gray-400 bg-no-repeat bg-center bg-[length:28px] text-gray-300 rounded-full p-2 w-10 h-10 flex justify-center items-center font-medium cursor-pointer transition-all duration-300 ease-in-out hover:bg-red-600 relative"
                style={{
                    backgroundImage: bgImage,
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <div
                    className={`${isDropdownOpen ? "opacity-100 h-auto" : "opacity-0 h-0"} auto_height absolute top-full right-0 z-40 overflow-hidden transition-all duration-500 delay-100 ease-in-out`}
                >
                    <div className="my-2 bg-zinc-800 rounded-xl text-lg font-extralight overflow-hidden whitespace-nowrap">
                        <button
                            className="profile_option"
                            onClick={() => handleChatClick()}
                        >
                            <MenuChatIcon />
                            <span>{t("navbar.profile.chat")}</span>
                        </button>
                        {auth.user?.role === "ADMIN" && (
                            <button
                                className="profile_option"
                                onClick={() => handleDashboardClick()}
                            >
                                <DashboardIcon />
                                <span>{t("navbar.profile.dashboard")}</span>
                            </button>
                        )}
                        <button
                            className="profile_option"
                            onClick={() => handleLogoutClick()}
                        >
                            <LogoutIcon />
                            <span>{t("navbar.profile.logout")}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
