import { combineReducers } from "redux";
import modulesReducer from "./modulesReducer";

const rootReducer = combineReducers({
  modules: modulesReducer,
});

export default rootReducer;