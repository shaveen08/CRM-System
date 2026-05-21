import React, { useEffect, useMemo, useRef, useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import { useDispatch, useSelector } from "react-redux";
import { newLead } from "../redux/actions/dashboardAction";

import { HugeiconsIcon } from "@hugeicons/react";

import {
  Cancel01Icon,
  Delete02Icon,
  Filter,
  PencilEdit01Icon,
  Search01Icon,
  Sorting05Icon,
} from "@hugeicons/core-free-icons";

import useDebounce from "../utils/useDebounce";

// Status options extracted as a constant for reuse in filter + form
const STATUS_OPTIONS = ["Completed", "Pending", "Dropped"];
const SOURCE_OPTIONS = ["Website", "Instagram", "LinkedIn", "Referral"];

const Lead = () => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const customerData =
    useSelector((state) => state.dashboard.customerLeads) || {};

  const customerLead = customerData?.leads || [];

  const colors = [
    "bg-red-50 text-red-700 border",
    "bg-green-50 text-green-700 border",
    "bg-blue-50 text-blue-700 border",
    "bg-purple-50 text-purple-700 border",
    "bg-pink-50 text-pink-700 border",
  ];

  const leadTableHead = [
    { title: "Name", sortable: true },
    { title: "Email", sortable: false },
    { title: "Phone", sortable: false },
    { title: "Source", sortable: false },
    { title: "Status", sortable: false },
    { title: "Deal Value", sortable: false },
    { title: "Created", sortable: true },
    { title: "Last Contacted", sortable: false },
    { title: "Action", sortable: false },
  ];

  // Search
  const [searchLead, setSearchLead] = useState("");
  const debouncedSearchText = useDebounce(searchLead, 500);

  // Sort States
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

  // Fake loading on search
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, [debouncedSearchText]);

  // Filter Modal
  const [filterModal, setFilterModal] = useState(false);
  const toggleFilterModal = () => setFilterModal((prev) => !prev);

  // selectedFilter is now actually used in filteredLeads below
  const [selectedFilter, setSelectedFilter] = useState([]);

  const handleSelectedFilter = (e, filterName) => {
    e.preventDefault();
    setSelectedFilter((prev) =>
      prev.includes(filterName)
        ? prev.filter((item) => item !== filterName)
        : [...prev, filterName],
    );
  };

  const clearFilters = () => setSelectedFilter([]);

  // selectedFilter is now applied in filteredLeads
  const filteredLeads = useMemo(() => {
    return [...customerLead]
      .filter((lead) => {
        const matchesSearch = lead.name
          ?.toLowerCase()
          .includes(debouncedSearchText.toLowerCase());

        const matchesFilter =
          selectedFilter.length === 0 || selectedFilter.includes(lead.status);

        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => {
        if (nameSort) {
          return nameSort === "asc"
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        }
        if (dateSort) {
          return dateSort === "asc"
            ? new Date(a.createdAt) - new Date(b.createdAt)
            : new Date(b.createdAt) - new Date(a.createdAt);
        }
        return 0;
      });
  }, [customerLead, debouncedSearchText, nameSort, dateSort, selectedFilter]);

  // Lazy Load
  const [visibleCount, setVisibleCount] = useState(7);
  const tableRef = useRef(null);

  const handleScroll = () => {
    const container = tableRef.current;
    if (!container) return;
    const { scrollTop, scrollHeight, clientHeight } = container;
    if (scrollTop + clientHeight >= scrollHeight - 50) {
      setVisibleCount((prev) =>
        prev >= filteredLeads.length ? prev : prev + 10,
      );
    }
  };

  useEffect(() => {
    setVisibleCount(7);
  }, [searchLead]);

  // Add Modal
  const [addModal, setAddModal] = useState(false);
  const toggleAddModal = () => setAddModal((prev) => !prev);

  // Format Date
  const formatDate = (date) => {
    const d = date.getDate().toString().padStart(2, "0");
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  };

  // getNextId is a function so it's always fresh when called
  const getNextId = () =>
    customerLead.length > 0 ? customerLead[customerLead.length - 1].id + 1 : 1;

  // initialLeadForm is now a function so it's always fresh
  const getInitialForm = () => ({
    id: getNextId(),
    name: "",
    email: "",
    phone: "",
    source: "",
    status: "",
    dealValue: "",
    createdAt: "",
    lastContacted: "",
  });

  const [addLeadFormData, setAddLeadFormData] = useState(getInitialForm);

  const handleAddLeadChange = (e) => {
    const { name, value } = e.target;
    setAddLeadFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddLead = (e) => {
    e.preventDefault();

    const currentDate = new Date();
    const createdDate = formatDate(currentDate);

    dispatch(
      newLead({
        ...addLeadFormData,
        createdAt: createdDate,
        lastContacted: createdDate,
      }),
    );

    // Reset form with fresh ID after dispatch (uses +1 from current length)
    setAddLeadFormData({
      ...getInitialForm(),
      id: customerLead.length + 1,
    });

    setAddModal(false);
  };

  return (
    <div className="flex h-screen w-full">
      <Sidebar />

      <div className="flex flex-col w-full ml-60 pt-16 overflow-hidden">
        <Navbar />

        <div className="p-4 flex flex-col gap-6">
          <section className="w-full bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-xl shadow-gray-200">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 bg-primary-50 border-b border-gray-100">
              <div>
                <h4 className="text-base font-semibold text-gray-800">
                  Customer Leads
                </h4>
                <p className="text-sm text-gray-500">Most recent leads data</p>
              </div>

              <div className="flex gap-3">
                {/* Search input now has value prop (controlled) */}
                <div className="relative">
                  <div className="absolute top-2.5 left-2">
                    <HugeiconsIcon
                      icon={Search01Icon}
                      size={17}
                      color="#747474"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Search leads..."
                    value={searchLead}
                    onChange={(e) => setSearchLead(e.target.value)}
                    className="bg-white border border-gray-200 rounded-lg px-3 pl-8 py-2 text-sm outline-none focus:border-primary-700"
                  />
                </div>

                {/* Filter Button */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={toggleFilterModal}
                    className="px-4 h-full flex items-center gap-1 font-medium text-gray-500 text-sm bg-white hover:bg-gray-50 rounded-lg border border-gray-200"
                  >
                    Filter
                    {selectedFilter.length > 0 && (
                      <span className="ml-1 bg-primary-700 text-white text-xs rounded-full px-1.5 py-0.5">
                        {selectedFilter.length}
                      </span>
                    )}
                    <HugeiconsIcon icon={Filter} size={16} />
                  </button>

                  {/* Filter Modal now actually renders with UI */}
                  {filterModal && (
                    <div className="absolute right-0 top-11 z-50 w-52 rounded-xl border border-gray-100 bg-white shadow-xl p-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                          Filter by Status
                        </p>
                        {selectedFilter.length > 0 && (
                          <button
                            onClick={clearFilters}
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
                        onClick={toggleFilterModal}
                        className="mt-3 w-full rounded-lg bg-primary-700 py-1.5 text-xs font-medium text-white hover:bg-primary-800"
                      >
                        Apply
                      </button>
                    </div>
                  )}
                </div>

                <button
                  onClick={toggleAddModal}
                  className="bg-primary-700 hover:bg-primary-800 transition text-white text-sm font-medium px-4 py-2 rounded-lg"
                >
                  + Add Lead
                </button>
              </div>
            </div>

            {/* Table */}
            <div
              ref={tableRef}
              onScroll={handleScroll}
              className="h-130 overflow-y-auto scrollbar-hide"
            >
              <table className="w-full text-sm">
                <thead className="bg-primary-50 sticky top-0 z-10">
                  <tr className="text-left text-gray-500 border-b border-gray-200">
                    {leadTableHead.map((head, index) => (
                      <th key={index} className="py-3 pl-4">
                        <div
                          className={`flex items-center gap-1 ${
                            head.sortable ? "cursor-pointer" : ""
                          }`}
                          onClick={() => {
                            if (head.title === "Name") sortNameLeads();
                            if (head.title === "Created") sortDateLeads();
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
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan="9"
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
                        {/* Name */}
                        <td className="py-4 pl-4">
                          <div className="flex gap-3 items-center">
                            <div
                              className={`h-9 w-9 flex items-center justify-center text-sm font-semibold rounded-full ${
                                colors[index % colors.length]
                              }`}
                            >
                              {lead.name?.[0]}
                            </div>
                            <span className="font-medium text-gray-800">
                              {lead.name}
                            </span>
                          </div>
                        </td>

                        <td className="text-gray-600">{lead.email}</td>
                        <td className="text-gray-600">{lead.phone}</td>
                        <td className="text-gray-600">{lead.source}</td>

                        {/* Status */}
                        <td>
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
                        </td>

                        <td className="font-semibold text-green-600">
                          ₹{lead.dealValue}
                        </td>
                        <td className="text-gray-500">{lead.createdAt}</td>
                        <td className="text-gray-500">{lead.lastContacted}</td>

                        {/* Actions */}
                        <td className="py-4 text-gray-500">
                          <div className="flex gap-2 items-center">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50 hover:bg-primary-100 cursor-pointer">
                              <HugeiconsIcon
                                icon={PencilEdit01Icon}
                                size={16}
                                color="#534ab7"
                              />
                            </div>
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 cursor-pointer">
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
                      <td colSpan="9" className="py-10">
                        <div className="flex flex-col items-center justify-center">
                          <p className="text-gray-500 font-medium">
                            No leads found
                          </p>
                          <span className="text-sm text-gray-400">
                            Try adjusting your search or filters
                          </span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>

      {/* Add Modal */}
      {addModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 bg-primary-50 p-4">
              <div>
                <h4 className="text-base font-semibold text-gray-800">
                  Add Lead
                </h4>
                <p className="text-sm text-gray-500">
                  Fill customer lead information
                </p>
              </div>
              <div
                onClick={toggleAddModal}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white hover:bg-gray-100 cursor-pointer"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={18} color="#6b7280" />
              </div>
            </div>

            <div className="p-4">
              <form
                onSubmit={handleAddLead}
                className="grid grid-cols-1 md:grid-cols-2 gap-5"
              >
                <input
                  type="text"
                  name="name"
                  value={addLeadFormData.name}
                  onChange={handleAddLeadChange}
                  placeholder="Name"
                  required
                  className="h-11 border border-gray-300 rounded-lg px-3 outline-none focus:border-primary-500"
                />

                <input
                  type="email"
                  name="email"
                  value={addLeadFormData.email}
                  onChange={handleAddLeadChange}
                  placeholder="Email"
                  required
                  className="h-11 border border-gray-300 rounded-lg px-3 outline-none focus:border-primary-500"
                />

                <input
                  type="tel"
                  name="phone"
                  value={addLeadFormData.phone}
                  onChange={handleAddLeadChange}
                  placeholder="Phone"
                  required
                  className="h-11 border border-gray-300 rounded-lg px-3 outline-none focus:border-primary-500"
                />

                <select
                  name="source"
                  value={addLeadFormData.source}
                  onChange={handleAddLeadChange}
                  required
                  className="h-11 border border-gray-300 rounded-lg px-3 outline-none focus:border-primary-500"
                >
                  <option value="">Select Source</option>
                  {SOURCE_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>

                <select
                  name="status"
                  value={addLeadFormData.status}
                  onChange={handleAddLeadChange}
                  required
                  className="h-11 border border-gray-300 rounded-lg px-3 outline-none focus:border-primary-500"
                >
                  <option value="">Select Status</option>
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  name="dealValue"
                  value={addLeadFormData.dealValue}
                  onChange={handleAddLeadChange}
                  placeholder="Deal Value"
                  required
                  className="h-11 border border-gray-300 rounded-lg px-3 outline-none focus:border-primary-500"
                />

                <div className="md:col-span-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={toggleAddModal}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-primary-700 px-4 py-2 text-sm font-medium text-white hover:bg-primary-800"
                  >
                    Save Lead
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Lead;
