import { HugeiconsIcon } from "@hugeicons/react";
import {
  Activity03Icon,
  Agreement02Icon,
  DashboardSquare01FreeIcons,
  UserGroupIcon,
  Settings02Icon,
  CheckListIcon,
  UserIcon,
  ContactIcon,
  Calendar03Icon,
} from "@hugeicons/core-free-icons";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import Navbar from "./Navbar";

const Sidebar = () => {
  const sidebarList = [
    {
      id: 1,
      menuName: "Dashboard",
      path: "/dashboard",
      icon: <HugeiconsIcon icon={DashboardSquare01FreeIcons} size={20} />,
    },
    {
      id: 2,
      menuName: "Lead",
      path: "/lead",
      icon: <HugeiconsIcon icon={UserGroupIcon} size={20} />,
    },
    {
      id: 3,
      menuName: "Contacts",
      path: "/contacts",
      icon: <HugeiconsIcon icon={ContactIcon} size={20} />,
    },
    {
      id: 4,
      menuName: "Activity",
      path: "/activity",
      icon: <HugeiconsIcon icon={Activity03Icon} size={20} />,
    },
    {
      id: 5,
      menuName: "Appointment",
      path: "/appointment",
      icon: <HugeiconsIcon icon={Calendar03Icon} size={20} />,
    },
    {
      id: 6,
      menuName: "Users",
      path: "/users",
      icon: <HugeiconsIcon icon={UserIcon} size={20} />,
    },
    // {
    //   id: 5,
    //   menuName: "Reminder",
    //   path: "/reminder",
    //   icon: <HugeiconsIcon icon={CheckListIcon} size={20} />,
    // },
    // {
    //   id: 6,
    //   menuName: "Settings",
    //   path: "/settings",
    //   icon: <HugeiconsIcon icon={Settings02Icon} size={20} />,
    // },
  ];

  return (
    <div className="fixed left-0 h-full w-60 flex flex-col gap-4 bg-white border-r border-gray-300">
      {/* Header */}
      <header className="border-b border-gray-300 pb-4 p-4">
        <h2 className="text-lg font-bold">CRM System</h2>
      </header>

      {/* Sidebar Menu */}
      <main className="flex flex-col gap-2 p-4">
        {sidebarList.map((list) => (
          <NavLink
            key={list.id}
            to={list.path}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 text-gray-500 rounded-lg transition ${
                isActive
                  ? "bg-primary-200 text-gray-900 font-bold"
                  : "hover:bg-primary-100"
              }`
            }
          >
            {list.icon}
            <span className="text-sm font-medium">{list.menuName}</span>
          </NavLink>
        ))}
      </main>
    </div>
  );
};

export default Sidebar;
