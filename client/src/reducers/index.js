import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import userReducer from "./userReducer";
import titleReducer from "./titleReducer";
import navReducer from "./navReducer";

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  users: userReducer,
  title: titleReducer,
  navItem: navReducer
});
