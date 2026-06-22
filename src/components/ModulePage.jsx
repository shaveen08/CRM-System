import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Tabel from "./Tabel";
import useNotification from "../utils/useNotification";

const ModulePage = ({ title, subtitle, fields, module, filter, endpoint }) => {
  const { triggerNotification, NotificationComponent } =
    useNotification("top-right");

  return (
    <div className="flex h-screen w-full">
      {NotificationComponent}
      <Sidebar />
      <div className="flex flex-col w-full ml-60 pt-16 overflow-hidden">
        <Navbar />
        <div className="p-4 flex flex-col gap-6">
          <Tabel
            title={title}
            subtitle={subtitle}
            fields={fields}
            module={module}
            triggerNotification={triggerNotification}
            filter={filter}
            endpoint={endpoint}
          />
        </div>
      </div>
    </div>
  );
};

export default ModulePage;
