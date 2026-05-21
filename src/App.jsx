import React, { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// Loader
import Skeleton from "./components/skeleton/Skeleton";

// JSON Data
import dashboardData from "./data/dashboardData.json";
import leadsData from "./data/leadsData.json";

// Reux
import { useDispatch } from "react-redux";
import {
  dashboardFetchData,
  dashboardCustomerLeads,
} from "./redux/actions/dashboardAction";

// Routing
import ProtectedRoutes from "./routes/ProtectedRoutes";
import Login from "./pages/Login";
import Registeration from "./pages/Registeration";

// Lazy routing
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Lead = lazy(() => import("./pages/Lead"));

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(dashboardFetchData(dashboardData));
    dispatch(dashboardCustomerLeads(leadsData));
  }, [dispatch]);

  return (
    <BrowserRouter>
      <div className="h-screen w-full flex">
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Registeration />} />

            {/* Private Routes */}
            <Route element={<ProtectedRoutes />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/lead" element={<Lead />} />
            </Route>
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
  );
};

export default App;
