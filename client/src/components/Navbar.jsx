import React, { useEffect, useState } from "react";
import userAvatar from "../assets/images/avatar.jpg";
import { HugeiconsIcon } from "@hugeicons/react";
import { Notification01FreeIcons } from "@hugeicons/core-free-icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Navbar = () => {
  const [notificationActive, setNotificationActive] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const routeTitleMap = {
    "/dashboard": "Dashboard",
    "/lead": "Lead",
    "/deals": "Deals",
    "/activity": "Activity",
    "/reminder": "Reminder",
    "/settings": "Settings",
    "/notification": "Notification",
  };

  const title = routeTitleMap[location.pathname];

  // Notification

  const notificationData = useSelector(
    (state) => state.modules.notificationData || [],
  );

  const unreadCount = notificationData.filter((item) => !item.isRead).length;

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
          className={`h-10 w-10 flex items-center justify-center border border-gray-300 rounded-xl cursor-pointer relative
          ${notificationActive ? "" : ""}`}
          onClick={() => navigate("/notification")}
        >
          <HugeiconsIcon icon={Notification01FreeIcons} size={20} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-2 min-w-4 h-4 px-1 flex items-center justify-center text-xs bg-red-600 text-white rounded-full">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
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
