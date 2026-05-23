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

    case "UPDATE_LEAD":
      return {
        ...state,
        customerLeads: {
          ...state.customerLeads,
          leads: state.customerLeads.leads.map((lead) =>
            lead.id === action.payload.id ? action.payload : lead,
          ),
        },
      };

    case "DELETE_LEAD":
      return {
        ...state,
        customerLeads: {
          ...state.customerLeads,
          leads: state.customerLeads.leads.filter(
            (lead) => lead.id !== action.payload,
          ),
        },
      };

    default:
      return state;
  }
};

export default dashboardReducer;
