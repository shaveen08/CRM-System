import React, { useEffect, useState } from "react";
import userAvatar from "../assets/images/avatar.jpg";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, Notification01FreeIcons } from "@hugeicons/core-free-icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const routeTitleMap = {
    "/dashboard": "Dashboard",
    "/lead": "Lead",
    "/deals": "Deals",
    "/activity": "Activity",
    "/appointment": "Appointment",
    "/notification": "Notification",
    "/settings": "Settings",
  };

  const title = routeTitleMap[location.pathname];

  // Notifications
  const notificationData = useSelector(
    (state) => state.modules.notificationData || [],
  );

  const unreadCount = notificationData.filter(
    (item) => item && !item.isRead,
  ).length;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = () => {
      setShowProfileMenu(false);
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedUser");
    navigate("/");
  };

  return (
    <>
      <div className="fixed top-0 left-60 right-0 h-15.25 border-b border-gray-300 bg-white flex items-center justify-between p-4 z-50">
        {/* Page Title */}
        <div>
          <h4 className="text-md font-semibold">{title}</h4>
        </div>

        {/* Right Section */}
        <div className="flex gap-2 items-center">
          {/* Notification */}
          <div
            className="relative h-10 w-10 flex items-center justify-center border border-gray-300 rounded-xl cursor-pointer"
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
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <img
              src={userAvatar}
              className="h-10 w-10 rounded-xl object-cover cursor-pointer"
              alt="Profile"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            />

            {showProfileMenu && (
              <div className="absolute right-0 top-12 w-56 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                {/* User Info */}
                <div className="p-4 border-b border-gray-100">
                  <h4 className="font-medium text-sm">Shaveen Kumar</h4>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>

                {/* Menu */}
                <button
                  className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100"
                  onClick={() => {
                    setShowProfileModal(true);
                    setShowProfileMenu(false);
                  }}
                >
                  My Profile
                </button>

                <button
                  className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100"
                  onClick={() => {
                    navigate("/settings");
                    setShowProfileMenu(false);
                  }}
                >
                  Settings
                </button>

                <button
                  className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100]"
          onClick={() => setShowProfileModal(false)}
        >
          <div
            className="bg-white w-full max-w-md rounded-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">My Profile</h3>

              <button
                onClick={() => setShowProfileModal(false)}
                className="text-gray-500 hover:text-black"
              >
                <HugeiconsIcon icon={Cancel01Icon} />
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex flex-col items-center">
              <img
                src={userAvatar}
                className="h-24 w-24 rounded-2xl object-cover mb-4"
                alt="Profile"
              />

              <h4 className="font-semibold text-lg">Shaveen Kumar</h4>

              <p className="text-sm text-gray-500">Administrator</p>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Email
                </label>
                <p className="font-medium">shaveen@crm.com</p>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Department
                </label>
                <p className="font-medium">Sales Management</p>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">Role</label>
                <p className="font-medium">Admin</p>
              </div>
            </div>

            <button
              className="mt-6 w-full py-2 rounded-lg bg-black text-white"
              onClick={() => setShowProfileModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
