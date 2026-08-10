import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { markNotificationRead } from "../redux/notifications/notificationAction";

const Notification = () => {
  const notificationData = useSelector(
    (state) => state.modules.notificationData || []
  );
  console.log(notificationData);

  // Mark as read
  const dispatch = useDispatch();
  const markAsRead = (notificationId) => {
    dispatch(markNotificationRead(notificationId));
  };

  return (
    <div className="flex h-screen w-full">
      <Sidebar />

      <div className="flex flex-col w-full ml-60 pt-16 overflow-hidden">
        <Navbar />

        <div className="p-4 flex flex-col gap-2 overflow-auto">
          {notificationData?.map((item, index) => (
            <div
              key={index}
              onClick={() => markAsRead(item.id)}
              className={`w-full px-3 py-4 flex justify-between items-end rounded-lg cursor-pointer border border-gray-100
                ${item.isRead === true ? "bg-gray-100" : "bg-white"}
            `}
            >
              <div>
                <h4 className="text-sm font-medium pb-0.5">
                  {item.title}
                </h4>
                <p className="text-gray-500 text-sm">{item.message}</p>
              </div>
              <div className="h-full flex flex-col justify-between items-end">
                <div
                  className={`h-2 w-2 rounded-full  ${!item.isRead ? "bg-red-500" : ""}`}
                ></div>
                <span className="text-xs text-gray-500">
                  {item.createdAt}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notification;
