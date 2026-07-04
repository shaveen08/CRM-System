import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Table from "./Table";
import { SidebarProvider } from "./SidebarContext";
import useNotification from "../utils/useNotification";

const ModulePage = ({ title, subtitle, module, filter, endpoint }) => {
  const { triggerNotification, NotificationComponent } =
    useNotification("top-right");

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-gray-50">
        {NotificationComponent}
        <Sidebar />
        
        <div className="flex flex-col w-full ml-0 lg:ml-60 pt-16 overflow-y-auto">
          <Navbar />
          <div className="p-3 sm:p-4 flex flex-col gap-6">
            <Table module={module} triggerNotification={triggerNotification} />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ModulePage;
