// components/ModulePage.jsx

import React, { useMemo } from "react";
import { useSelector } from "react-redux";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Tabel from "../components/Tabel";

const ModulePage = ({ selector, dataKey, title, subtitle, fields, module }) => {
  const customerData = useSelector(selector) || {};
  const data = customerData?.[dataKey] || [];

  // Auto-generate tableHead from first item's keys
  const tableHead = useMemo(() => {
    if (data.length === 0) return [];

    return Object.keys(data[0])
      .filter((key) => key !== "id")
      .map((key) => ({
        key,
        title: key
          .replace(/_/g, " ")
          .replace(/([a-z])([A-Z])/g, "$1 $2")
          .replace(/\b\w/g, (c) => c.toUpperCase()),
        sortable: key === "name" || key === "createdAt",
      }));
  }, [data]);

  return (
    <div className="flex h-screen w-full">
      <Sidebar />

      <div className="flex flex-col w-full ml-60 pt-16 overflow-hidden">
        <Navbar />

        <div className="p-4 flex flex-col gap-6">
          <Tabel
            title={title}
            subtitle={subtitle}
            tableHead={tableHead}
            data={data}
            fields={fields}
            module={module}
          />
        </div>
      </div>
    </div>
  );
};

export default ModulePage;
