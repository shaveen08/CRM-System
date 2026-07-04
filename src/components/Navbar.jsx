import React, { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  Notification01FreeIcons,
  Mail01Icon,
  UserAccountIcon,
  OfficeIcon,
  Menu01Icon,
} from "@hugeicons/core-free-icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useSidebar } from "./SidebarContext";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toggle } = useSidebar();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const routeTitleMap = {
    "/dashboard": "Dashboard",
    "/leads": "Leads",
    "/contacts": "Contacts",
    "/activities": "Activities",
    "/appointments": "Appointments",
    "/users": "Users",
    "/notification": "Notification",
  };

  // Fallback: if a route isn't in the map above, derive a readable title
  // from the URL itself instead of showing nothing (e.g. "/deals" -> "Deals").
  const title =
    routeTitleMap[location.pathname] ||
    location.pathname
      .replace("/", "")
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

  // -- Notifications ----------------------------------------------------------------------------------------------
  // const notificationData = useSelector(
  //   (state) => state.modules.notificationData || [],
  // );

  // const unreadCount = notificationData.filter(
  //   (item) => item && !item.isRead,
  // ).length;

  // --- Logged User -----------------------------------------------------------------------------------------------
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser")) || {};

  // --- Close dropdown on outside click ----------------------------------------------------------------------------
  useEffect(() => {
    const handleClickOutside = () => setShowProfileMenu(false);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // --- Logout ------------------------------------------------------------------------------------------------------
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedUser");
    navigate("/");
  };

  // --- Avatar: use loggedUser.avatar from JSON, fallback to UI Avatars ----------------------------------------------
  const avatarUrl =
    loggedUser.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(loggedUser.name || "U")}&background=4361ee&color=fff&size=128&rounded=true`;

  return (
    <>
      <div className="fixed top-0 left-0 lg:left-60 right-0 h-15.25 border-b border-gray-300 bg-white flex items-center justify-between p-4 z-40">
        {/* Left Section: Hamburger (mobile/tablet) + Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            className="lg:hidden h-10 w-10 flex items-center justify-center border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
            aria-label="Toggle menu"
          >
            <HugeiconsIcon icon={Menu01Icon} size={20} />
          </button>
          <h4 className="text-md font-semibold truncate">{title}</h4>
        </div>

        {/* Right Section */}
        <div className="flex gap-2 items-center shrink-0">
          {/* Notification */}
          <div
            className="relative h-10 w-10 flex items-center justify-center border border-gray-300 rounded-xl cursor-pointer"
            onClick={() => navigate("/notification")}
          >
            <HugeiconsIcon icon={Notification01FreeIcons} size={20} />
            {/* {unreadCount > 0 && (
              <span className="absolute -top-1 -right-2 min-w-4 h-4 px-1 flex items-center justify-center text-xs bg-red-600 text-white rounded-full">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )} */}
          </div>

          {/* Profile Trigger */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <img
              src={avatarUrl}
              className="h-10 w-10 rounded-xl object-cover cursor-pointer"
              alt={loggedUser.name || "Profile"}
              onClick={() => setShowProfileMenu((prev) => !prev)}
            />

            {/* Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 top-12 w-60 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50">
                {/* User Info */}
                <div className="flex items-center gap-3 p-4 border-b border-gray-100">
                  <img
                    src={avatarUrl}
                    className="h-10 w-10 rounded-xl object-cover"
                    alt={loggedUser.name}
                  />
                  <div className="flex flex-col">
                    <h4 className="font-semibold text-sm leading-tight">
                      {loggedUser.name}
                    </h4>
                    <p className="text-xs text-gray-400">{loggedUser.role}</p>
                    {loggedUser.department && (
                      <p className="text-xs text-gray-400">
                        {loggedUser.department}
                      </p>
                    )}
                  </div>
                </div>

                {/* Menu Items */}
                <button
                  className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors"
                  onClick={() => {
                    setShowProfileModal(true);
                    setShowProfileMenu(false);
                  }}
                >
                  My Profile
                </button>

                <button
                  className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors"
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
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-100 p-4"
          onClick={() => setShowProfileModal(false)}
        >
          <div
            className="bg-white w-full max-w-md rounded-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">My Profile</h3>
              <button
                onClick={() => setShowProfileModal(false)}
                className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 hover:text-black transition-colors"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={18} />
              </button>
            </div>

            {/* Avatar + Name */}
            <div className="flex flex-col items-center mb-6">
              <img
                src={avatarUrl}
                className="h-24 w-24 rounded-2xl object-cover mb-3 shadow-md"
                alt={loggedUser.name}
              />
              <h4 className="font-semibold text-lg">{loggedUser.name}</h4>
              <p className="text-sm text-gray-400">{loggedUser.role}</p>

              {/* Status Badge */}
              <span
                className={`mt-2 text-xs font-medium px-3 py-1 rounded-full ${
                  loggedUser.status === "Active"
                    ? "bg-green-50 text-green-600"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {loggedUser.status || "Active"}
              </span>
            </div>

            {/* Details Grid */}
            <div className="space-y-3">
              {/* Email */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="h-8 w-8 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                  <HugeiconsIcon
                    icon={Mail01Icon}
                    size={15}
                    color="#4361ee"
                    strokeWidth={1.8}
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-400">Email</p>
                  <p className="text-sm font-medium truncate">
                    {loggedUser.email}
                  </p>
                </div>
              </div>

              {/* Department */}
              {loggedUser.department && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="h-8 w-8 bg-purple-50 rounded-lg flex items-center justify-center shrink-0">
                    <HugeiconsIcon
                      icon={OfficeIcon}
                      size={15}
                      color="#7c3aed"
                      strokeWidth={1.8}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400">Department</p>
                    <p className="text-sm font-medium truncate">
                      {loggedUser.department}
                    </p>
                  </div>
                </div>
              )}

              {/* Role */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="h-8 w-8 bg-orange-50 rounded-lg flex items-center justify-center shrink-0">
                  <HugeiconsIcon
                    icon={UserAccountIcon}
                    size={15}
                    color="#f4845f"
                    strokeWidth={1.8}
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-400">Role</p>
                  <p className="text-sm font-medium truncate">
                    {loggedUser.role}
                  </p>
                </div>
              </div>
            </div>

            <button
              className="mt-6 w-full py-2.5 rounded-xl bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors"
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
