import React, { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { notificationModuleData } from "./redux/notifications/notificationAction";

// Routing
import ProtectedRoutes from "./routes/ProtectedRoutes";
import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";

// Lazy routing
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Leads = lazy(() => import("./pages/Leads"));
const Contacts = lazy(() => import("./pages/Contacts"));
const Activities = lazy(() => import("./pages/Activities"));
const Appointments = lazy(() => import("./pages/Appointment"));
const Users = lazy(() => import("./pages/Users"));
const Notification = lazy(() => import("./pages/Notification"));

const App = () => {
  return (
    <BrowserRouter>
      <div className="h-screen w-full flex">
        <Suspense
          fallback={
            <div className="flex h-screen w-full items-center justify-center bg-gray-50">
              <div className="flex flex-col items-center gap-3">
                <div className="h-10 w-10 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin" />
                <p className="text-sm text-gray-400">Loading...</p>
              </div>
            </div>
          }
        >
          <Routes>
            {/* Public */}
            <Route path="/" element={<Login />} />

            {/* Dashboard */}
            <Route element={<ProtectedRoutes permission="dashboard" />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>

            {/* Leads */}
            <Route element={<ProtectedRoutes permission="leads" />}>
              <Route path="/leads" element={<Leads />} />
            </Route>

            {/* Contacts */}
            <Route element={<ProtectedRoutes permission="contacts" />}>
              <Route path="/contacts" element={<Contacts />} />
            </Route>

            {/* Activities */}
            <Route element={<ProtectedRoutes permission="activities" />}>
              <Route path="/activities" element={<Activities />} />
            </Route>

            {/* Appointments */}
            <Route element={<ProtectedRoutes permission="appointments" />}>
              <Route path="/appointments" element={<Appointments />} />
            </Route>

            {/* Users */}
            <Route element={<ProtectedRoutes permission="users" />}>
              <Route path="/users" element={<Users />} />
            </Route>

            {/* Notification - if everyone logged in can access */}
            <Route element={<ProtectedRoutes />}>
              <Route path="/notification" element={<Notification />} />
            </Route>

            {/* Unauthorized */}
            <Route path="/unauthorized" element={<Unauthorized />} />
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
  );
};

export default App;
