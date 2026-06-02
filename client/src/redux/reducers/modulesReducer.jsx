const initialState = {
  dashboardData: {},
  leadsData: [],
  contactData: [],
  activityData: [],
};

const modulesReducer = (state = initialState, action) => {
  switch (action.type) {
    case "DASHBOARD_DATA":
      return { ...state, dashboardData: action.payload };
    case "LEADS_DATA":
      return { ...state, leadsData: action.payload };
    case "CONTACTS_DATA":
      return { ...state, contactData: action.payload };
    case "ACTIVITY_DATA":
      return { ...state, activityData: action.payload };

    // Lead
    case "NEW_LEAD":
      return { ...state, leadsData: [...state.leadsData, action.payload] };
    case "UPDATE_LEAD":
      return {
        ...state,
        leadsData: state.leadsData.map((item) =>
          item.id === action.payload.id ? action.payload : item,
        ),
      };
    case "DELETE_LEAD":
      return {
        ...state,
        leadsData: state.leadsData.filter((item) => item.id !== action.payload),
      };
    case "DELETE_MULTIPLE_LEADS":
      return {
        ...state,
        leadsData: state.leadsData.filter(
          (item) => !action.payload.includes(item.id),
        ),
      };

    // Contact
    case "NEW_CONTACT":
      return { ...state, contactData: [...state.contactData, action.payload] };
    case "UPDATE_CONTACT":
      return {
        ...state,
        contactData: state.contactData.map((item) =>
          item.id === action.payload.id ? action.payload : item,
        ),
      };
    case "DELETE_CONTACT":
      return {
        ...state,
        contactData: state.contactData.filter(
          (item) => item.id !== action.payload,
        ),
      };
    case "DELETE_MULTIPLE_CONTACTS":
      return {
        ...state,
        contactData: state.contactData.filter(
          (item) => !action.payload.includes(item.id),
        ),
      };

    // Activity
    case "NEW_ACTIVITY":
      return {
        ...state,
        activityData: [...state.activityData, action.payload],
      };
    case "UPDATE_ACTIVITY":
      return {
        ...state,
        activityData: state.activityData.map((item) =>
          item.id === action.payload.id ? action.payload : item,
        ),
      };
    case "DELETE_ACTIVITY":
      return {
        ...state,
        activityData: state.activityData.filter(
          (item) => item.id !== action.payload,
        ),
      };
    case "DELETE_MULTIPLE_ACTIVITIES":
      return {
        ...state,
        activityData: state.activityData.filter(
          (item) => !action.payload.includes(item.id),
        ),
      };

    default:
      return state;
  }
};

export default modulesReducer;
