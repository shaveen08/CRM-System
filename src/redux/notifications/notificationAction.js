// Notification Actions

export const NOTIFICATION_DATA = "NOTIFICATION_DATA";
export const MARK_NOTIFICATION_READ = "MARK_NOTIFICATION_READ";

export const notificationModuleData = (data) => ({
  type: NOTIFICATION_DATA,
  payload: data,
});

export const markNotificationRead = (data) => ({
  type: MARK_NOTIFICATION_READ,
  payload: data,
});
