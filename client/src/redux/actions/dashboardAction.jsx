export const dashboardFetchData = (data) => ({
  type: "DASHBOARD_FETCH",
  payload: data,
});

export const dashboardCustomerLeads = (data) => ({
  type: "DASHBOARD_LEADS",
  payload: data,
});

export const newLead = (data) => ({
  type: "NEW_LEAD",
  payload: data,
});

export const updateLead = (updatedLead) => ({
  type: "UPDATE_LEAD",
  payload: updatedLead,
});