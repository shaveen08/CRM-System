import React, { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// Loader
import Skeleton from "./components/skeleton/Skeleton";

// JSON Data
import dashboardData from "./data/dashboardData.json";
import leadsData from "./data/leadsData.json";
import contactData from "./data/contactData.json";
import activityData from "./data/activityData.json";

// Reux
import { useDispatch } from "react-redux";
import {
  dashboardModuleData,
  leadModuleData,
  contactModuleData,
  activityModuleData,
} from "./redux/actions/modulesAction";

// Routing
import ProtectedRoutes from "./routes/ProtectedRoutes";
import Login from "./pages/Login";
import Registeration from "./pages/Registeration";

// Lazy routing
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Lead = lazy(() => import("./pages/Lead"));
const Contacts = lazy(() => import("./pages/Contacts"));
const Activity = lazy(() => import("./pages/Activity"));

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(dashboardModuleData(dashboardData));
    dispatch(leadModuleData(leadsData));
    dispatch(contactModuleData(contactData));
    dispatch(activityModuleData(activityData));
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
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/activity" element={<Activity />} />
            </Route>
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
  );
};

export default App;
