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
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import { NavLink } from "react-router-dom";
import { useSidebar } from "./SidebarContext";

const Sidebar = () => {
  const { isOpen, close } = useSidebar();

  const sidebarList = [
    {
      id: 1,
      menuName: "dashboard",
      path: "/dashboard",
      icon: <HugeiconsIcon icon={DashboardSquare01FreeIcons} size={20} />,
    },
    {
      id: 2,
      menuName: "leads",
      path: "/leads",
      icon: <HugeiconsIcon icon={UserGroupIcon} size={20} />,
    },
    {
      id: 3,
      menuName: "contacts",
      path: "/contacts",
      icon: <HugeiconsIcon icon={ContactIcon} size={20} />,
    },
    {
      id: 4,
      menuName: "activities",
      path: "/activities",
      icon: <HugeiconsIcon icon={Activity03Icon} size={20} />,
    },
    {
      id: 5,
      menuName: "appointments",
      path: "/appointments",
      icon: <HugeiconsIcon icon={Calendar03Icon} size={20} />,
    },
    {
      id: 6,
      menuName: "users",
      path: "/users",
      icon: <HugeiconsIcon icon={UserIcon} size={20} />,
    },
  ];

  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
  const userAccess = loggedUser?.access || [];

  const filteredList = sidebarList.filter((item) =>
    userAccess.includes(item.menuName),
  );

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={close}
          aria-hidden="true"
        />
      )}

      <div
        className={`fixed left-0 top-0 h-full w-60 flex flex-col gap-4 bg-white border-r border-gray-300 z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <header className="border-b border-gray-300 pb-4 p-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">CRM System</h2>
          <button
            onClick={close}
            className="lg:hidden h-8 w-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 hover:text-black transition-colors"
            aria-label="Close menu"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={18} />
          </button>
        </header>

        <main className="flex flex-col gap-2 p-4 overflow-y-auto">
          {filteredList.map((list) => (
            <NavLink
              key={list.id}
              to={list.path}
              onClick={close}
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
    </>
  );
};

export default Sidebar;
