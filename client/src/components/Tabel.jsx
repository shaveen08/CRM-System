import React, { useState, useEffect, useRef, useMemo } from "react";
import { useDispatch } from "react-redux";
import {
  newLead,
  updateLead,
  deleteLead,
  deleteMultipleLeads,
  newContact,
  updateContact,
  deleteContact,
  deleteMultipleContacts,
  newActivity,
  updateActivity,
  deleteActivity,
  newUser,
  deleteMultipleActivities,
  updateUser,
  deleteUser,
  deleteMultipleUsers,
} from "../redux/actions/modulesAction";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Delete02Icon,
  Filter,
  PencilEdit01Icon,
  Search01Icon,
  Sorting05Icon,
  Upload06Icon,
  ViewIcon,
} from "@hugeicons/core-free-icons";

import useDebounce from "../utils/useDebounce";
import AddModal from "./modals/AddModal";
import EditModal from "./modals/EditModal";
import DeleteModal from "./modals/DeleteModal";
import ViewModal from "./modals/ViewModal";
import UploadModal from "./modals/UploadModal";

const STATUS_OPTIONS = ["Completed", "Pending", "Dropped"];

const ACTION_MAP = {
  lead: {
    add: newLead,
    update: updateLead,
    remove: deleteLead,
    bulkRemove: deleteMultipleLeads,
  },
  contact: {
    add: newContact,
    update: updateContact,
    remove: deleteContact,
    bulkRemove: deleteMultipleContacts,
  },
  activity: {
    add: newActivity,
    update: updateActivity,
    remove: deleteActivity,
    bulkRemove: deleteMultipleActivities,
  },
  user: {
    add: newUser,
    update: updateUser,
    remove: deleteUser,
    bulkRemove: deleteMultipleUsers,
  },
};

const Tabel = ({
  data,
  title,
  subtitle,
  tableHead,
  fields,
  module,
  triggerNotification,
}) => {
  const dispatch = useDispatch();

  const actions = ACTION_MAP[module] || ACTION_MAP.lead;

  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [uploadModal, setUploadModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [deleteLeadId, setDeleteLeadId] = useState(null);

  const totaldata = data.length || "0";

  const [searchLead, setSearchLead] = useState("");
  const debouncedSearchText = useDebounce(searchLead, 500);

  const [nameSort, setNameSort] = useState("asc");
  const [dateSort, setDateSort] = useState("");

  const sortNameLeads = () => {
    setNameSort((prev) => (prev === "asc" ? "desc" : "asc"));
    setDateSort("");
  };
  const sortDateLeads = () => {
    setDateSort((prev) => (prev === "asc" ? "desc" : "asc"));
    setNameSort("");
  };

  // Date format
  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, [debouncedSearchText]);

  const [filterModal, setFilterModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState([]);

  const handleSelectedFilter = (e, filterName) => {
    e.preventDefault();
    setSelectedFilter((prev) =>
      prev.includes(filterName)
        ? prev.filter((item) => item !== filterName)
        : [...prev, filterName],
    );
  };

  const filteredLeads = useMemo(() => {
    return [...data]
      .filter((item) => {
        const matchesSearch =
          !debouncedSearchText ||
          Object.values(item).some((val) =>
            String(val)
              .toLowerCase()
              .includes(debouncedSearchText.toLowerCase()),
          );
        const matchesFilter =
          selectedFilter.length === 0 || selectedFilter.includes(item.status);
        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => {
        if (nameSort && a.name && b.name)
          return nameSort === "asc"
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        if (dateSort && a.createdAt && b.createdAt)
          return dateSort === "asc"
            ? new Date(a.createdAt) - new Date(b.createdAt)
            : new Date(b.createdAt) - new Date(a.createdAt);
        return 0;
      });
  }, [data, debouncedSearchText, nameSort, dateSort, selectedFilter]);

  const [selectedIds, setSelectedIds] = useState([]);
  const handleCheckbox = (id) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  const handleSelectAll = () => {
    const visibleIds = filteredLeads.slice(0, visibleCount).map((l) => l.id);
    const allSelected = visibleIds.every((id) => selectedIds.includes(id));
    setSelectedIds(allSelected ? [] : visibleIds);
  };
  const handleBulkDelete = () => {
    dispatch(actions.bulkRemove(selectedIds));
    setSelectedIds([]);
  };

  const [visibleCount, setVisibleCount] = useState(7);
  const tableRef = useRef(null);
  const handleScroll = () => {
    const el = tableRef.current;
    if (!el) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 50)
      setVisibleCount((prev) =>
        prev >= filteredLeads.length ? prev : prev + 10,
      );
  };

  useEffect(() => {
    setVisibleCount(7);
  }, [searchLead]);

  const colors = [
    "bg-red-50 text-red-700 border",
    "bg-green-50 text-green-700 border",
    "bg-blue-50 text-blue-700 border",
    "bg-purple-50 text-purple-700 border",
    "bg-pink-50 text-pink-700 border",
  ];

  const downloadCSVBtn = () => {
    const headers = tableHead.map((h) => `"${h.title.trim()}"`).join(",");
    const blob = new Blob([headers], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <section className="w-full max-w-full bg-white border border-gray-100 rounded-xl overflow-hidden shadow-xl shadow-gray-200">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 bg-primary-50 border-b border-gray-100">
          <div>
            <h4 className="text-base font-semibold text-gray-800">
              {title}
              <span className="ml-1 bg-white border text-purple-700 text-xs px-2 py-0 rounded-full">
                {totaldata}
              </span>
            </h4>
            <p className="text-sm text-gray-500">{subtitle}</p>
          </div>

          <div className="flex gap-3">
            {/* Search */}
            <div className="relative">
              <div className="absolute top-2.5 left-2">
                <HugeiconsIcon icon={Search01Icon} size={17} color="#747474" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                value={searchLead}
                onChange={(e) => setSearchLead(e.target.value)}
                className="bg-white border border-gray-200 rounded-lg px-3 pl-8 py-2 text-sm outline-none focus:border-primary-700"
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setFilterModal((p) => !p)}
                className="px-4 h-full flex items-center gap-1 font-medium text-gray-500 text-sm bg-white hover:bg-gray-50 rounded-lg border border-gray-200"
              >
                Filter
                {selectedFilter.length > 0 && (
                  <span className="ml-1 bg-primary-700 text-white text-xs rounded-full px-1.5 py-0.5">
                    {selectedFilter.length}
                  </span>
                )}
                <HugeiconsIcon icon={Filter} size={16} strokeWidth={2} />
              </button>

              {filterModal && (
                <div className="absolute right-0 top-11 z-50 w-52 rounded-xl border border-gray-100 bg-white shadow-xl shadow-gray-200 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      Filter by Status
                    </p>
                    {selectedFilter.length > 0 && (
                      <button
                        onClick={() => setSelectedFilter([])}
                        className="text-xs text-primary-700 hover:underline"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    {STATUS_OPTIONS.map((status) => (
                      <button
                        key={status}
                        onClick={(e) => handleSelectedFilter(e, status)}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition ${
                          selectedFilter.includes(status)
                            ? "bg-primary-100 text-primary-700 font-medium"
                            : "hover:bg-gray-50 text-gray-600"
                        }`}
                      >
                        {status}
                        {selectedFilter.includes(status) && (
                          <span className="h-2 w-2 rounded-full bg-primary-700" />
                        )}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setFilterModal(false)}
                    className="mt-3 w-full rounded-lg bg-primary-700 py-1.5 text-xs font-medium text-white hover:bg-primary-800"
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>

            {/* Upload */}
            <button
              onClick={() => setUploadModal(true)}
              className="bg-white hover:bg-gray-50 text-gray-500 font-medium flex items-center gap-1.5 border border-gray-200 transition text-sm px-4 py-2 rounded-lg"
            >
              Upload
              <HugeiconsIcon icon={Upload06Icon} size={18} strokeWidth={2} />
            </button>

            {/* Add */}
            <button
              onClick={() => setAddModal(true)}
              className="bg-primary-700 hover:bg-primary-800 transition text-white text-sm font-medium px-4 py-2 rounded-lg"
            >
              + Add
            </button>
          </div>
        </div>

        {/* Bulk delete bar */}
        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between px-4 py-2 bg-primary-50 border-b border-primary-100">
            <span className="text-sm text-primary-700 font-medium">
              {selectedIds.length} record{selectedIds.length > 1 ? "s" : ""}{" "}
              selected
            </span>
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition"
            >
              <HugeiconsIcon icon={Delete02Icon} size={14} color="#fff" />
              Delete Selected ({selectedIds.length})
            </button>
          </div>
        )}

        {/* Table */}
        <div
          ref={tableRef}
          onScroll={handleScroll}
          className="h-130 overflow-auto scrollbar-hide"
        >
          <table className="w-full text-sm">
            {/* Table Head */}
            <thead className="bg-primary-50 sticky top-0 z-10">
              <tr className="text-left text-gray-500 border-b border-gray-200">
                <th className="p-2 pl-6 w-10">
                  <input
                    type="checkbox"
                    className="h-3.5 w-3.5 cursor-pointer"
                    checked={
                      filteredLeads.slice(0, visibleCount).length > 0 &&
                      filteredLeads
                        .slice(0, visibleCount)
                        .every((l) => selectedIds.includes(l.id))
                    }
                    onChange={handleSelectAll}
                  />
                </th>
                {tableHead.map((head) => (
                  <th key={head.key} className="py-3 pl-4">
                    <div
                      className={`flex items-center gap-1 ${head.sortable ? "cursor-pointer" : ""}`}
                      onClick={() => {
                        if (head.key === "name") sortNameLeads();
                        if (head.key === "createdAt") sortDateLeads();
                      }}
                    >
                      {head.title}
                      {head.sortable && (
                        <HugeiconsIcon
                          icon={Sorting05Icon}
                          size={15}
                          color="#5c50e0"
                        />
                      )}
                    </div>
                  </th>
                ))}
                <th className="py-3 pl-4">Action</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={tableHead.length + 2}
                    className="text-center py-10 text-gray-400"
                  >
                    Loading...
                  </td>
                </tr>
              ) : filteredLeads.length > 0 ? (
                filteredLeads.slice(0, visibleCount).map((lead, index) => (
                  <tr
                    key={lead.id}
                    className="border-b border-gray-100 hover:bg-primary-50/40 transition"
                  >
                    <td className="p-2 pl-6">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(lead.id)}
                        onChange={() => handleCheckbox(lead.id)}
                        className="h-3.5 w-3.5 cursor-pointer"
                      />
                    </td>

                    {tableHead.map((column) => (
                      <td
                        key={column.key}
                        className={`py-4 pl-4 text-gray-600 ${
                          column.key === "createdAt" ||
                          column.key === "lastLogin"
                            ? "whitespace-nowrap min-w-35"
                            : ""
                        }`}
                      >
                        {column.key === "name" ? (
                          <div className="flex gap-3 items-center">
                            <div
                              className={`h-9 w-9 flex items-center justify-center text-sm font-semibold rounded-full ${colors[index % colors.length]}`}
                            >
                              {lead.name?.[0]}
                            </div>
                            <span className="font-medium text-gray-800 whitespace-nowrap">
                              {lead.name}
                            </span>
                          </div>
                        ) : column.key === "status" ? (
                          <span
                            className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                              lead.status === "Completed"
                                ? "bg-green-50 text-green-700"
                                : lead.status === "Dropped"
                                  ? "bg-red-50 text-red-700"
                                  : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {lead.status}
                          </span>
                        ) : column.key === "dealValue" ? (
                          <span className="font-semibold text-green-600">
                            ₹{lead.dealValue}
                          </span>
                        ) : column.key === "access" ? (
                          <div className="flex flex-wrap gap-1 max-w-55">
                            {(Array.isArray(lead.access)
                              ? lead.access
                              : String(lead.access).split(",")
                            ).map((item) => (
                              <span
                                key={item}
                                className="px-2 py-1 text-xs rounded-full bg-primary-50 text-primary-700"
                              >
                                {item.trim()}
                              </span>
                            ))}
                          </div>
                        ) : column.key === "createdAt" ? (
                          formatDate(lead.createdAt)
                        ) : column.key === "lastLogin" ? (
                          formatDate(lead.lastLogin)
                        ) : (
                          lead[column.key] || "-"
                        )}
                      </td>
                    ))}

                    <td className="py-4 pl-4">
                      <div className="flex gap-2 items-center">
                        <div
                          onClick={() => {
                            setSelectedLead(lead);
                            setEditModal(true);
                          }}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50 hover:bg-primary-100 cursor-pointer"
                        >
                          <HugeiconsIcon
                            icon={PencilEdit01Icon}
                            size={16}
                            color="#534ab7"
                          />
                        </div>
                        <div
                          onClick={() => {
                            setSelectedLead(lead);
                            setViewModal(true);
                          }}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 hover:bg-teal-100 cursor-pointer"
                        >
                          <HugeiconsIcon
                            icon={ViewIcon}
                            size={16}
                            color="#0F766E"
                          />
                        </div>
                        <div
                          onClick={() => {
                            setDeleteLeadId(lead.id);
                            setDeleteModal(true);
                          }}
                          className="flex h-8 w-8 mr-4 items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 cursor-pointer"
                        >
                          <HugeiconsIcon
                            icon={Delete02Icon}
                            size={16}
                            color="#cd0000"
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={tableHead.length + 2}
                    className="py-10 text-center"
                  >
                    <p className="text-gray-500 font-medium">No data found</p>
                    <span className="text-sm text-gray-400">
                      Try adjusting your search or filters
                    </span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <AddModal
        isOpen={addModal}
        onClose={() => setAddModal(false)}
        data={data}
        dispatch={dispatch}
        fields={fields}
        addAction={actions.add}
        triggerNotification={triggerNotification}
      />
      <EditModal
        isOpen={editModal}
        onClose={() => setEditModal(false)}
        lead={selectedLead}
        dispatch={dispatch}
        fields={fields}
        updateAction={actions.update}
        triggerNotification={triggerNotification}
      />
      <DeleteModal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        deleteLeadId={deleteLeadId}
        dispatch={dispatch}
        deleteAction={actions.remove}
        triggerNotification={triggerNotification}
      />
      <ViewModal
        isOpen={viewModal}
        onClose={() => setViewModal(false)}
        lead={selectedLead}
        onEdit={() => {
          setViewModal(false);
          setEditModal(true);
        }}
      />
      <UploadModal
        isOpen={uploadModal}
        onClose={() => setUploadModal(false)}
        downloadCSVBtn={downloadCSVBtn}
      />
    </div>
  );
};

export default Tabel;
