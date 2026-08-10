import axios from "axios";

export const DASHBOARD_DATA = "DASHBOARD_DATA";
export const DASHBOARD_LOADING = "DASHBOARD_LOADING";
export const DASHBOARD_ERROR = "DASHBOARD_ERROR";

// Correct thunk pattern
export const getDashboardData = () => async (dispatch) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/dashboard`);
    dispatch({ type: DASHBOARD_LOADING });
    dispatch({ type: DASHBOARD_DATA, payload: response.data.data });
  } catch (error) {
    dispatch({ type: DASHBOARD_ERROR, payload: error.message });
    console.error(error.message || error);
  }
};
