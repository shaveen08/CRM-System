import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Table from "./Table";
import useNotification from "../utils/useNotification";

const ModulePage = ({ title, subtitle, module, filter, endpoint }) => {
  const { triggerNotification, NotificationComponent } =
    useNotification("top-right");

  return (
    <div className="flex h-screen w-full">
      {NotificationComponent}
      <Sidebar />
      <div className="flex flex-col w-full ml-60 pt-16 overflow-hidden">
        <Navbar />
        <div className="p-4 flex flex-col gap-6">
          <Table module={module} triggerNotification={triggerNotification} />
        </div>
      </div>
    </div>
  );
};

export default ModulePage;
