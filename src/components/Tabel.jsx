import React, { useState, useEffect, useRef, useMemo } from "react";
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
import FilterModal from "./modals/FilterModal";
import UserCreate from "./UserCreate";
import UserEdit from "./UserEdit";

import axios from "axios";

const Tabel = ({
  title,
  subtitle,
  fields,
  module,
  triggerNotification,
  filter,
  endpoint,
}) => {
  // API Fetch ---------------------------------------------------------------------------------- /
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAPI = async () => {
    try {
      setError(null);
      const response = await axios.get(endpoint);
      setApiData(response.data.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAPI();
  }, [endpoint]);

  // Dynamic table head -------------------------------------------------------------------------- /
  // Fields we never want as visible columns — internal Mongo bookkeeping fields.
  const EXCLUDED_KEYS = ["_id", "__v", "updatedAt", "first_name", "last_name"];

  // Matches ISO date strings like "2026-05-22T07:12:49.328Z" so date-shaped
  // values automatically get formatted instead of showing the raw timestamp.
  const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;

  const tableHead = useMemo(() => {
    if (!apiData || apiData.length === 0) return [];

    const sample = apiData[0];
    const hasSplitName = "first_name" in sample || "last_name" in sample;

    const generatedColumns = Object.keys(sample)
      .filter((key) => !EXCLUDED_KEYS.includes(key))
      .map((key) => {
        const value = sample[key];
        const isDate =
          key === "createdAt" ||
          key === "lastLogin" ||
          (typeof value === "string" && ISO_DATE_REGEX.test(value));

        return {
          key,
          // Prettify camelCase / snake_case keys into readable titles,
          // e.g. "dealValue" -> "Deal Value", "first_name" -> "First Name"
          title: key
            .replace(/_/g, " ")
            .replace(/([a-z])([A-Z])/g, "$1 $2")
            .replace(/\b\w/g, (c) => c.toUpperCase()),
          sortable: key === "name" || key === "createdAt",
          type: isDate ? "date" : undefined,
        };
      });

    // first_name/last_name are excluded from the loop above (raw fields, not
    // meant to be separate columns), so we inject one combined "name" column
    // in their place — this is what renders the avatar initial + full name.
    if (hasSplitName) {
      return [
        { key: "name", title: "Name", sortable: true },
        ...generatedColumns,
      ];
    }

    return generatedColumns;
  }, [apiData]);

  // ---------------------------------------------------------------------------------------------- /

  const totaldata = apiData?.length || 0;

  // Modals
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [uploadModal, setUploadModal] = useState(false);

  const [selectedLead, setSelectedLead] = useState(null);
  const [deleteLeadId, setDeleteLeadId] = useState(null);

  const [showUserCreate, setShowUserCreate] = useState(false);
  const [showUserEdit, setShowUserEdit] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [searchLead, setSearchLead] = useState("");
  const debouncedSearchText = useDebounce(searchLead, 500);

  const [nameSort, setNameSort] = useState("asc");
  const [dateSort, setDateSort] = useState("");

  const [filterModal, setFilterModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [visibleCount, setVisibleCount] = useState(7);

  const tableRef = useRef(null);

  // Sorting -------------------------------------------------------------------------------------- /
  const sortNameLeads = () => {
    setNameSort((p) => (p === "asc" ? "desc" : "asc"));
    setDateSort("");
  };
  const sortDateLeads = () => {
    setDateSort((p) => (p === "asc" ? "desc" : "asc"));
    setNameSort("");
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  useEffect(() => {
    setVisibleCount(7);
  }, [searchLead, selectedFilter, nameSort, dateSort]);

  // Returns a comparable full name whether the record uses first_name/last_name
  // or a single combined name field — keeps sorting working for either schema.
  const getDisplayName = (item) =>
    item.first_name
      ? `${item.first_name} ${item.last_name || ""}`.trim()
      : item.name || "";

  // Filter, Sort ----------------------------------------------------------------------------------- /
  const filteredLeads = useMemo(() => {
    return [...apiData]
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
        if (nameSort) {
          const nameA = getDisplayName(a);
          const nameB = getDisplayName(b);
          if (nameA && nameB)
            return nameSort === "asc"
              ? nameA.localeCompare(nameB)
              : nameB.localeCompare(nameA);
        }
        if (dateSort && a.createdAt && b.createdAt)
          return dateSort === "asc"
            ? new Date(a.createdAt) - new Date(b.createdAt)
            : new Date(b.createdAt) - new Date(a.createdAt);
        return 0;
      });
  }, [apiData, debouncedSearchText, nameSort, dateSort, selectedFilter]);

  const handleCheckbox = (id) =>
    setSelectedIds((p) =>
      p.includes(id) ? p.filter((i) => i !== id) : [...p, id],
    );

  const handleSelectAll = () => {
    const visibleIds = filteredLeads.slice(0, visibleCount).map((l) => l._id);
    const allSelected = visibleIds.every((id) => selectedIds.includes(id));
    setSelectedIds(allSelected ? [] : visibleIds);
  };

  const handleScroll = () => {
    const el = tableRef.current;
    if (!el) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 50)
      setVisibleCount((p) => (p >= filteredLeads.length ? p : p + 10));
  };

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

  const fullPageWrapper =
    "w-full h-[calc(100vh-120px)] bg-white border border-gray-100 rounded-xl shadow-xl shadow-gray-200 p-6 overflow-hidden";

  if (showUserCreate) {
    return (
      <div className={fullPageWrapper}>
        <UserCreate
          onBack={() => setShowUserCreate(false)}
          triggerNotification={triggerNotification}
        />
      </div>
    );
  }

  if (showUserEdit) {
    return (
      <div className={fullPageWrapper}>
        <UserEdit
          user={editingUser}
          onBack={() => {
            setShowUserEdit(false);
            setEditingUser(null);
          }}
          triggerNotification={triggerNotification}
        />
      </div>
    );
  }

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

          {/* Table Header Actions */}
          <div className="flex gap-3">
            {/* Search Field */}
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

            {/* Filter Button */}
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
                <FilterModal
                  filter={filter}
                  selectedFilter={selectedFilter}
                  setSelectedFilter={setSelectedFilter}
                  onClose={() => setFilterModal(false)}
                />
              )}
            </div>

            {/* Upload Button */}
            <button
              onClick={() => setUploadModal(true)}
              className="bg-white hover:bg-gray-50 text-gray-500 font-medium flex items-center gap-1.5 border border-gray-200 transition text-sm px-4 py-2 rounded-lg"
            >
              Upload
              <HugeiconsIcon icon={Upload06Icon} size={18} strokeWidth={2} />
            </button>

            {/* Add Button */}
            <button
              onClick={() =>
                module === "user" ? setShowUserCreate(true) : setAddModal(true)
              }
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
          className="h-130 scroll-auto overflow-auto"
        >
          <table className="w-full text-sm text-nowrap">
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
                        .every((l) => selectedIds.includes(l._id))
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
              ) : error ? (
                <tr>
                  <td
                    colSpan={tableHead.length + 2}
                    className="py-10 text-center"
                  >
                    <p className="text-red-500 font-medium">{error}</p>
                    <button
                      onClick={fetchAPI}
                      className="mt-2 text-sm text-primary-700 underline"
                    >
                      Retry
                    </button>
                  </td>
                </tr>
              ) : filteredLeads.length > 0 ? (
                filteredLeads.slice(0, visibleCount).map((lead, index) => (
                  <tr
                    key={lead._id}
                    className="border-b border-gray-100 hover:bg-primary-50/40 transition"
                  >
                    <td className="p-2 pl-6">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(lead._id)}
                        onChange={() => handleCheckbox(lead._id)}
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
                          (() => {
                            // Some modules (leads) store first_name/last_name
                            // separately; others may use a single name field.
                            // Combine whichever is present so the avatar and
                            // label always have a value to render.
                            const fullName = lead.first_name
                              ? `${lead.first_name} ${lead.last_name || ""}`.trim()
                              : lead.name || "";
                            const initial = (
                              lead.first_name ||
                              lead.name ||
                              "?"
                            )
                              .charAt(0)
                              .toUpperCase();

                            return (
                              <div className="flex gap-3 items-center">
                                <div
                                  className={`h-9 w-9 flex items-center justify-center text-sm font-semibold rounded-full ${colors[index % colors.length]}`}
                                >
                                  {initial}
                                </div>
                                <span className="font-medium text-gray-800 whitespace-nowrap">
                                  {fullName || "-"}
                                </span>
                              </div>
                            );
                          })()
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
                        ) : column.type === "date" ? (
                          formatDate(lead[column.key])
                        ) : (
                          (lead[column.key] ?? "-")
                        )}
                      </td>
                    ))}

                    {/* Row action button */}
                    <td className="py-4 pl-4">
                      <div className="flex gap-2 items-center">
                        {/* Edit Action */}
                        <div
                          onClick={() => {
                            if (module === "user") {
                              setEditingUser(lead);
                              setShowUserEdit(true);
                            } else {
                              setSelectedLead(lead);
                              setEditModal(true);
                            }
                          }}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50 hover:bg-primary-100 cursor-pointer"
                        >
                          <HugeiconsIcon
                            icon={PencilEdit01Icon}
                            size={16}
                            color="#534ab7"
                          />
                        </div>

                        {/* View Action */}
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

                        {/* Delete Action */}
                        <div
                          onClick={() => {
                            setDeleteLeadId(lead._id);
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
        fields={fields}
        endpoint={endpoint}
        onSuccess={fetchAPI}
        triggerNotification={triggerNotification}
      />

      <EditModal
        isOpen={editModal}
        onClose={() => setEditModal(false)}
        lead={selectedLead}
        endpoint={endpoint}
        fields={fields}
        onSuccess={fetchAPI}
        triggerNotification={triggerNotification}
      />
      
      <DeleteModal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        deleteID={deleteLeadId}
        endpoint={endpoint}
        onSuccess={fetchAPI}
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
