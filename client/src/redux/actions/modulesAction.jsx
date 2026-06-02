// Modules
export const dashboardModuleData = (data) => ({
  type: "DASHBOARD_DATA",
  payload: data,
});
export const leadModuleData = (data) => ({ type: "LEADS_DATA", payload: data });
export const contactModuleData = (data) => ({
  type: "CONTACTS_DATA",
  payload: data,
});
export const activityModuleData = (data) => ({
  type: "ACTIVITY_DATA",
  payload: data,
});

// Lead
export const newLead = (data) => ({ type: "NEW_LEAD", payload: data });
export const updateLead = (data) => ({ type: "UPDATE_LEAD", payload: data });
export const deleteLead = (id) => ({ type: "DELETE_LEAD", payload: id });
export const deleteMultipleLeads = (ids) => ({
  type: "DELETE_MULTIPLE_LEADS",
  payload: ids,
});

// Contact
export const newContact = (data) => ({ type: "NEW_CONTACT", payload: data });
export const updateContact = (data) => ({
  type: "UPDATE_CONTACT",
  payload: data,
});
export const deleteContact = (id) => ({ type: "DELETE_CONTACT", payload: id });
export const deleteMultipleContacts = (ids) => ({
  type: "DELETE_MULTIPLE_CONTACTS",
  payload: ids,
});

// Activity
export const newActivity = (data) => ({ type: "NEW_ACTIVITY", payload: data });
export const updateActivity = (data) => ({
  type: "UPDATE_ACTIVITY",
  payload: data,
});
export const deleteActivity = (id) => ({
  type: "DELETE_ACTIVITY",
  payload: id,
});
export const deleteMultipleActivities = (ids) => ({
  type: "DELETE_MULTIPLE_ACTIVITIES",
  payload: ids,
});
