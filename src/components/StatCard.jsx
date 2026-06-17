import React, { useEffect, useState } from "react";
import leads from "../data/leads.json";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const StatCard = () => {
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://randomuser.me/api/?results=20`);
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

      const data = await response.json();
      setApiData(data.results);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const chartData = leads.monthlyLeads;

  return (
    <div>
      <div className="h-full w-full bg-gray-100 p-3 border border-gray-200 rounded-lg">
        {/* Stat Header */}
        <h3 className="font-semibold">
          Total Leads: {leads.summary.totalLeads}
        </h3>

        {/* API Status */}
        {loading && (
          <p className="text-sm text-gray-400 mt-1">Loading users...</p>
        )}

        {error && <p className="text-sm text-red-400 mt-1">Error: {error}</p>}
        {!loading && !error && (
          <p className="text-sm text-green-500 mt-1">
            {apiData.length} users loaded from API
          </p>
        )}

        <LineChart
          width={500}
          height={200}
          className="mt-4"
          data={chartData}        // ✅ connected
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="total"     stroke="#6366f1" name="Total" />
          <Line type="monotone" dataKey="completed" stroke="#10b981" name="Completed" />
          <Line type="monotone" dataKey="pending"   stroke="#f59e0b" name="Pending" />
        </LineChart>
      </div>
    </div>
  );
};

export default StatCard;
