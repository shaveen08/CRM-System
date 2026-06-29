// Notification Reducer

import {
  NOTIFICATION_DATA,
  MARK_NOTIFICATION_READ,
} from "./notificationAction";

const inititalState = {
  notificationsData: [],
};

const notificationReducer = (state = inititalState, action) => {
  switch (action.type) {
    case NOTIFICATION_DATA:
      return { ...state, notificationData: action.payload };

    case MARK_NOTIFICATION_READ:
      return {
        ...state,
        notificationData: state.notificationData.map((item) =>
          item.id === action.payload ? { ...item, isRead: true } : item,
        ),
      };

    default:
      return state;
  }
};

export default notificationReducer;
