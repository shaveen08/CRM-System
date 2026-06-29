import { combineReducers } from "redux";

import notificationReducer from "./notifications/notificationReducer";
import dashboardReducer from "./dashboard/dashboardReducer";

const rootReducer = combineReducers({
  notification: notificationReducer,
  dashboard: dashboardReducer,
});

export default rootReducer;
