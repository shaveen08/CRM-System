import React, { useEffect, useRef, useState, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

// import dashboardJson from "../data/dashboardData.json";
// import { useDispatch } from "react-redux";
// import { dashboardModuleData } from "../redux/actions/modulesAction";

// Icons
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar03Icon,
  ChartUpIcon,
  DashboardBrowsingIcon,
  Download04Icon,
  SaveMoneyDollarIcon,
  UserCheck01Icon,
  UserGroupIcon,
  UserSwitchIcon,
  UserTime01Icon,
} from "@hugeicons/core-free-icons";

// Redux
import { useSelector } from "react-redux";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const Dashboard = () => {
  // Date ---------------------------------------------------------------------------------------------------------------
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) setCurrentTime("Good Morning");
    else if (hours < 18) setCurrentTime("Good Afternoon");
    else setCurrentTime("Good Evening");
  }, []);

  // --- Redux data ------------------------------------------------------------------------------------------------------------------------- /
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(dashboardModuleData(dashboardJson));
  // }, [dispatch]);

  const dashboardData =
    useSelector((state) => state.modules.dashboardData) || {};
  const leadsData = useSelector((state) => state.modules.leadsData) || [];
  
  // --- Date ------------------------------------------------------------------------------------------------------------------------------- /
  const formattedDate = new Date().toLocaleDateString("en-GB");
  const [datePicker, setDatePicker] = useState("");
  const datePickerRef = useRef(null);

  const openPicker = () => {
    if (!datePickerRef.current) return;
    if (datePickerRef.current.showPicker) {
      datePickerRef.current.showPicker();
    } else {
      datePickerRef.current.focus();
    }
  };

  // --- Filtered Leads  ------------------------------------------------------------------------------------------------------------------- /
  const filteredLeads = useMemo(() => {
    if (!datePicker) return leadsData;
    return leadsData.filter((lead) => {
      if (!lead.createdAt) return false;
      return lead.createdAt.substring(0, 10) === datePicker;
    });
  }, [leadsData, datePicker]);

  // --- Export  -------------------------------------------------------------------------------------------------------------------------- /
  const handleExport = () => {
    if (!filteredLeads.length) return;

    const headers = Object.keys(filteredLeads[0]).join(",");
    const rows = filteredLeads.map((lead) =>
      Object.values(lead)
        .map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`)
        .join(","),
    );
    const csv = [headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `leads-export-${datePicker || new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // --- KPI derived values  --------------------------------------------------------------------------------------------------------------- /
  const pendingLeads = useMemo(
    () => filteredLeads.filter((l) => l.status === "Pending"),
    [filteredLeads],
  );

  const completedLeads = useMemo(
    () => filteredLeads.filter((l) => l.status === "Completed"),
    [filteredLeads],
  );

  const revenueLead = useMemo(() => {
    const values = filteredLeads
      .filter((l) => l.dealValue)
      .map((l) => l.dealValue);
    return values.length ? values.reduce((a, b) => a + b, 0) : 0;
  }, [filteredLeads]);

  const kpiCards = [
    {
      title: "Total Leads",
      value: filteredLeads.length,
      badge: "+12 this week",
      icon: (
        <HugeiconsIcon
          icon={UserGroupIcon}
          size={16}
          strokeWidth={1.8}
          color="#534AB7"
        />
      ),
    },
    {
      title: "Pending Leads",
      value: pendingLeads.length,
      badge: "42 pending",
      icon: (
        <HugeiconsIcon
          icon={UserTime01Icon}
          size={16}
          strokeWidth={1.8}
          color="#854F0B"
        />
      ),
    },
    {
      title: "Converted Leads",
      value: completedLeads.length,
      badge: "+18 converted",
      icon: (
        <HugeiconsIcon
          icon={UserCheck01Icon}
          size={16}
          strokeWidth={1.8}
          color="#185FA5"
        />
      ),
    },
    {
      title: "Revenue Generated",
      value: `₹${revenueLead.toLocaleString()}`,
      badge: "+₹6k revenue",
      icon: (
        <HugeiconsIcon
          icon={SaveMoneyDollarIcon}
          size={16}
          strokeWidth={1.8}
          color="#3B6D11"
        />
      ),
    },
  ];

  // --- Chart helpers -------------------------------------------------------------------------------------------------------------------- /
  const [activeTab, setActiveTab] = useState("monthly");
  const conversionData = dashboardData?.conversion?.[activeTab] || [];
  const dealPerformance = dashboardData?.dealPerformance || [];

  const getWeekNumber = (dateString) => {
    const date = new Date(dateString);
    const oneJan = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date - oneJan) / 86400000);
    return Math.ceil((date.getDay() + 1 + days) / 7);
  };

  const { monthlyLeadsChartData, weeklyLeads, dailyLeads } = useMemo(() => {
    const monthly = {};
    const weekly = {};
    const daily = {};
    const monthMap = {};

    filteredLeads.forEach((lead) => {
      if (!lead.createdAt) return;

      const month = lead.createdAt.substring(0, 7);
      const year = lead.createdAt.substring(0, 4);
      const week = getWeekNumber(lead.createdAt);
      const day = lead.createdAt.substring(0, 10);
      const weekKey = `${year}-W${week}`;

      monthly[month] = (monthly[month] || 0) + 1;
      weekly[weekKey] = (weekly[weekKey] || 0) + 1;
      daily[day] = (daily[day] || 0) + 1;

      if (!monthMap[month]) {
        monthMap[month] = {
          month,
          total: 0,
          pending: 0,
          converted: 0,
          dropped: 0,
        };
      }
      monthMap[month].total += 1;
      if (lead.status === "Pending") monthMap[month].pending += 1;
      if (lead.status === "Completed") monthMap[month].converted += 1;
      if (lead.status === "Dropped") monthMap[month].dropped += 1;
    });

    const monthlyLeadsChartData = Object.entries(monthMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, val]) => ({
        ...val,
        month: new Date(key + "-01").toLocaleString("en-US", {
          month: "short",
          year: "2-digit",
        }),
      }));

    return { monthlyLeadsChartData, weeklyLeads: weekly, dailyLeads: daily };
  }, [filteredLeads]);

  // --- Logged User Details  ---------------------------------------------------------------------------------------------------------------- /
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));

  return (
    <div className="flex h-screen w-full bg-gray-50">
      <Sidebar />

      <div className="flex flex-col w-full ml-60 pt-16 overflow-y-auto">
        <Navbar />

        <div className="p-5 flex flex-col gap-5">
          {/* Page Header */}
          <div className="flex items-center justify-between w-full">
            <section className="flex flex-col gap-1">
              <h1 className="text-2xl text-gray-900 font-semibold">
                {currentTime}, {loggedUser.name}
              </h1>
              <p className="text-sm text-gray-400">{formattedDate}</p>
            </section>

            <section className="relative flex items-center gap-3">
              {/* Date Picker */}
              <div className="flex items-center gap-2">
                <div onClick={openPicker} className="cursor-pointer">
                  <div className="h-full flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white">
                    <div className="p-3 bg-gray-50 border-r border-gray-200 flex items-center justify-center">
                      <HugeiconsIcon icon={Calendar03Icon} size={18} />
                    </div>
                    <div className="px-4 text-sm text-gray-600">
                      {datePicker
                        ? new Date(datePicker).toLocaleDateString("en-GB")
                        : "Select Date"}
                    </div>
                  </div>
                  <input
                    type="date"
                    ref={datePickerRef}
                    value={datePicker}
                    onChange={(e) => setDatePicker(e.target.value)}
                    className="absolute opacity-0 pointer-events-none w-0 h-0"
                  />
                </div>

                {/* Clear button */}
                {datePicker && (
                  <button
                    onClick={() => setDatePicker("")}
                    className="text-xs text-gray-400 hover:text-gray-600 px-3 py-2 rounded-xl border border-gray-200 bg-white transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Export Button */}
              <button
                type="button"
                onClick={handleExport}
                className="px-5 py-3 flex items-center gap-2 bg-primary-600 hover:bg-primary-500 active:bg-primary-700 text-white rounded-xl text-sm font-medium transition-colors"
              >
                <HugeiconsIcon
                  icon={Download04Icon}
                  size={16}
                  strokeWidth={2.2}
                />
                Export
              </button>
            </section>
          </div>

          {/* KPI Cards */}
          <section className="grid grid-cols-4 gap-4">
            {kpiCards.map((card, index) => (
              <div
                key={index}
                className="bg-white border border-gray-100 rounded-2xl p-3 flex flex-col gap-6 shadow-xl shadow-gray-100"
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`h-9 w-9 flex items-center justify-center rounded-lg
                      ${
                        card.title === "Total Leads"
                          ? "text-purple-700 bg-purple-50"
                          : card.title === "Pending Leads"
                            ? "text-yellow-700 bg-yellow-50"
                            : card.title === "Converted Leads"
                              ? "text-blue-700   bg-blue-50"
                              : card.title === "Revenue Generated"
                                ? "text-green-700  bg-green-50"
                                : ""
                      }`}
                  >
                    {card.icon}
                  </div>

                  <span
                    className={`text-xs font-medium px-3 py-1.5 rounded-full
                      ${
                        card.title === "Total Leads"
                          ? "text-purple-700 bg-purple-50"
                          : card.title === "Pending Leads"
                            ? "text-yellow-700 bg-yellow-50"
                            : card.title === "Converted Leads"
                              ? "text-blue-700   bg-blue-50"
                              : card.title === "Revenue Generated"
                                ? "text-green-700  bg-green-50"
                                : ""
                      }`}
                  >
                    {card.badge}
                  </span>
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-1">{card.title}</p>
                  <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
                    {card.value ?? "—"}
                  </h1>
                </div>
              </div>
            ))}
          </section>

          {/* Charts */}
          <section className="grid grid-cols-2 gap-4">
            {/* Conversion Rate */}
            <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-lg shadow-gray-100">
              <div className="flex items-start justify-between mb-3">
                <div className="flex flex-col items-start gap-2.5">
                  <div className="flex gap-2 items-center">
                    <div className="h-9 w-9 bg-green-50 flex items-center justify-center rounded-lg">
                      <HugeiconsIcon
                        icon={UserSwitchIcon}
                        size={16}
                        strokeWidth={1.5}
                        color="#3B6D11"
                      />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-800">
                        Conversion Rate
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Conversion rate overview
                      </p>
                    </div>
                  </div>
                  <p className="text-3xl font-semibold tracking-tight text-gray-900">
                    {dashboardData?.summary?.conversionRate || "—"}
                  </p>
                </div>

                <div className="h-11 w-fit bg-gray-50 flex items-center p-1 rounded-lg">
                  {["daily", "weekly", "monthly"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                        activeTab === tab
                          ? "bg-gray-300 text-black"
                          : "text-gray-500"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <ResponsiveContainer width="100%" height={180}>
                <AreaChart
                  data={conversionData}
                  margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="totalGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#7E57C2" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#7E57C2" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="convertedGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#4CAF50" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="rateGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#FF9800" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#FF9800" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f3f4f6"
                  />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="#7E57C2"
                    fill="url(#totalGradient)"
                    strokeWidth={2.5}
                    dot={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="converted"
                    stroke="#4CAF50"
                    fill="url(#convertedGradient)"
                    strokeWidth={2.5}
                    dot={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="rate"
                    stroke="#FF9800"
                    fill="url(#rateGradient)"
                    strokeWidth={2.5}
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>

              <div className="flex items-center gap-4 pt-4 ml-4">
                <span className="flex items-center gap-1.5 text-xs text-gray-400">
                  <span className="w-2 h-2 rounded-full bg-purple-600 inline-block" />{" "}
                  Total
                </span>
                <span className="flex items-center gap-1.5 text-xs text-gray-400">
                  <span className="w-2 h-2 rounded-full bg-orange-500 inline-block" />{" "}
                  Converted
                </span>
                <span className="flex items-center gap-1.5 text-xs text-gray-400">
                  <span className="w-2 h-2 rounded-full bg-green-600 inline-block" />{" "}
                  Rate
                </span>
              </div>
            </div>

            {/* Monthly Lead Growth */}
            <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-lg shadow-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-linear-to-br from-indigo-100 to-indigo-50 flex items-center justify-center">
                    <HugeiconsIcon
                      icon={ChartUpIcon}
                      size={16}
                      strokeWidth={1.8}
                      color="#4361ee"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-900 font-semibold">
                      Monthly Lead Growth
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Lead performance overview
                    </p>
                  </div>
                </div>
                <div className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[12px] font-medium rounded-full">
                  +18.4%
                </div>
              </div>

              <ResponsiveContainer width="100%" height={240}>
                <BarChart
                  data={monthlyLeadsChartData}
                  barGap={5}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(0,0,0,0.03)" }}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #f1f5f9",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
                    }}
                  />
                  <Bar dataKey="total" fill="#4361ee" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="pending" fill="#e9c46a" radius={[6, 6, 0, 0]} />
                  <Bar
                    dataKey="converted"
                    fill="#2a9d8f"
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar dataKey="dropped" fill="#bc4749" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>

              <div className="flex items-center gap-4 flex-wrap my-2 ml-4">
                {[
                  { color: "#4361ee", label: "Total" },
                  { color: "#e9c46a", label: "Pending" },
                  { color: "#2a9d8f", label: "Converted" },
                  { color: "#bc4749", label: "Dropped" },
                ].map(({ color, label }) => (
                  <div key={label} className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: color }}
                    />
                    <p className="text-[12px] text-gray-500">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Deal Performance */}
            <div className="bg-white border col-span-2 border-gray-100 rounded-xl p-3 shadow-lg shadow-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-linear-to-br from-indigo-100 to-indigo-50 flex items-center justify-center">
                    <HugeiconsIcon
                      icon={DashboardBrowsingIcon}
                      size={20}
                      strokeWidth={1.8}
                      color="#4361ee"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800">
                      Deal Performance
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Deal performance overview
                    </p>
                  </div>
                </div>
                <div className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[12px] font-medium rounded-full">
                  +18.4%
                </div>
              </div>

              <div className="flex items-center gap-5 flex-wrap mb-5">
                {[
                  { color: "#2196f3", label: "Won Deals" },
                  { color: "#f44236", label: "Lost Deals" },
                  { color: "#ffca29", label: "Pending" },
                ].map(({ color, label }) => (
                  <div key={label} className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: color }}
                    />
                    <p className="text-[12px] text-gray-500">{label}</p>
                  </div>
                ))}
              </div>

              <ResponsiveContainer width="100%" height={260}>
                <LineChart
                  data={dealPerformance}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#94a3b8" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#94a3b8" }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #f1f5f9",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
                    }}
                    cursor={{ stroke: "#cbd5e1", strokeDasharray: "4 4" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="won"
                    stroke="#2196f3"
                    strokeWidth={1.8}
                    dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="lost"
                    stroke="#f44236"
                    strokeWidth={1.8}
                    dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="pending"
                    stroke="#ffca29"
                    strokeWidth={1.8}
                    dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Activity Feed */}
          <section className="grid grid-cols-2 gap-4">
            {/* Recent Activities */}
            <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-lg shadow-gray-100">
              <div className="mb-5">
                <h3 className="text-sm font-semibold text-gray-800">
                  Recent Activities
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Latest CRM updates
                </p>
              </div>
              <div className="flex flex-col gap-4">
                {dashboardData?.recentActivities
                  ?.slice(0, 6)
                  .map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 pb-2 border-b border-gray-100"
                    >
                      <div className="h-9 w-9 rounded-full bg-violet-100 flex items-center justify-center text-sm font-medium text-violet-700">
                        {activity.user.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">{activity.user}</span>{" "}
                          {activity.action}
                        </p>
                        <span className="text-xs text-gray-400">
                          {activity.time}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Upcoming Reminders */}
            <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-lg shadow-gray-100">
              <div className="mb-5">
                <h3 className="text-sm font-semibold text-gray-800">
                  Upcoming Reminders
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Scheduled follow-ups & meetings
                </p>
              </div>
              <div className="flex flex-col gap-4">
                {dashboardData?.upcomingReminders?.map((reminder) => (
                  <div
                    key={reminder.id}
                    className="border border-gray-100 rounded-xl p-4 flex items-center justify-between"
                  >
                    <div>
                      <h3 className="text-sm font-medium text-gray-800">
                        {reminder.title}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1">
                        {reminder.date} • {reminder.time}
                      </p>
                    </div>
                    <div className="relative flex items-center justify-center">
                      <span className="absolute inline-flex h-3 w-3 rounded-full bg-purple-400 opacity-75 animate-ping" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-purple-500" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
