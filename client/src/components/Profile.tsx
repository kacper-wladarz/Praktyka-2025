import { useContext, useState } from "react";
import UserDropdown from "./UserDropdown";
import { GlobalContext } from "../App";

const Profile = () => {
    const { userData } = useContext(GlobalContext);
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const [bgImage, setBgImage] = useState(`url('/account.svg')`);

    const svg = `
    <svg width="24" height="24" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <text
        x="50%" y="50%" font-size="80" font-family="Poppins, sans-serif" font-weight="400" text-anchor="middle" dy=".3em" fill="white">
        ${userData?.login.charAt(0).toUpperCase()}
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

    return (
        <div className="flex items-center">
            <div
                className="bg-gray-400 bg-no-repeat bg-center bg-[length:28px] text-gray-300 rounded-full p-2 w-10 h-10 flex justify-center items-center font-medium cursor-pointer transition-all duration-300 ease-in-out hover:bg-red-600"
                style={{
                    backgroundImage: bgImage,
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            ></div>
        </div>
    );
};

export default Profile;
