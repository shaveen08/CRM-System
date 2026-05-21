import React, { useState } from "react";
import userAvatar from "../assets/images/avatar.jpg";
import { HugeiconsIcon } from "@hugeicons/react";
import { Notification01FreeIcons } from "@hugeicons/core-free-icons";
import { useLocation } from "react-router-dom";

const Navbar = () => {
  const [notificationActive, setNotificationActive] = useState(false);

  const location = useLocation();

  const routeTitleMap = {
    "/dashboard": "Dashboard",
    "/lead": "Lead",
    "/deals": "Deals",
    "/activity": "Activity",
    "/reminder": "Reminder",
    "/settings": "Settings",
  };

  const title = routeTitleMap[location.pathname];

  return (
    <div className="fixed top-0 left-60 right-0 h-15.25 border-b border-gray-300 bg-white flex items-center justify-between p-4 z-50">
      {/* Active modal */}
      {/* Left side nav content */}
      <div>
        <h4 className="text-md font-semibold">{title}</h4>
      </div>

      {/* Right side nav content */}
      <div className="flex gap-2 items-center">
        <div
          className={`h-10 w-10 flex items-center justify-center border border-gray-300 rounded-xl cursor-pointer
          ${notificationActive ? "" : ""}`}
        >
          <HugeiconsIcon icon={Notification01FreeIcons} size={20} />
        </div>
        {/* Profile */}
        <div>
          <img
            src={userAvatar}
            className="h-10 rounded-xl cursor-pointer"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
