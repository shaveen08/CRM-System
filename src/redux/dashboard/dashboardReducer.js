import {
  DASHBOARD_DATA,
  DASHBOARD_LOADING,
  DASHBOARD_ERROR,
} from "./dashboardAction";

const initialState = {
  dashboardData: {},
  loading: false,
  error: null,
};

const dashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case DASHBOARD_LOADING:
      return {
        ...state,
        loading: true,
        error: null,
      };
      
    case DASHBOARD_DATA:
      return {
        ...state,
        loading: false,
        dashboardData: action.payload,
      };

    case DASHBOARD_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default dashboardReducer;
