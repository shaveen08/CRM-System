import React, { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// Loader
import Skeleton from "./components/skeleton/Skeleton";

// JSON Data
import dashboardData from "./data/dashboardData.json";
import leadsData from "./data/leadsData.json";
import contactData from "./data/contactData.json";
import activityData from "./data/activityData.json";
import appointmentData from "./data/appointmentsData.json";
import userData from "./data/userData.json";
import notificationsData from "./data/notificationsData.json";

// Redux
import { useDispatch } from "react-redux";
import {
  dashboardModuleData,
  leadModuleData,
  contactModuleData,
  activityModuleData,
  userModuleData,
  notificationModuleData,
  appointmentModuleData,
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
const Appointment = lazy(() => import("./pages/Appointment"));
const Users = lazy(() => import("./pages/Users"));
const Notification = lazy(() => import("./pages/Notification"));

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(dashboardModuleData(dashboardData));
    dispatch(leadModuleData(leadsData));
    dispatch(contactModuleData(contactData));
    dispatch(activityModuleData(activityData));
    dispatch(appointmentModuleData(appointmentData));
    dispatch(userModuleData(userData));
    dispatch(notificationModuleData(notificationsData));
  }, [dispatch]);

  return (
    <BrowserRouter>
      <div className="h-screen w-full flex">
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Login />} />
            {/* <Route path="/register" element={<Registeration />} /> */}

            {/* Private Routes */}
            <Route element={<ProtectedRoutes />}>
              {/* Modules */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/lead" element={<Lead />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/activity" element={<Activity />} />
              <Route path="/appointment" element={<Appointment />} />
              <Route path="/users" element={<Users />} />

              {/* Notification */}
              <Route path="/notification" element={<Notification />} />
            </Route>
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
  );
};

export default App;
