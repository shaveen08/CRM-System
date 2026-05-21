const initialState = {
  data: null,
  customerLeads: [],
};

const dashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case "DASHBOARD_FETCH":
      return {
        ...state,
        data: action.payload,
      };

    case "DASHBOARD_LEADS":
      return {
        ...state,
        customerLeads: action.payload,
      };

    case "NEW_LEAD":
      return {
        ...state,
        customerLeads: {
          ...state.customerLeads,
          leads: [...state.customerLeads.leads, action.payload],
        },
      };

    default:
      return state;
  }
};

export default dashboardReducer;
