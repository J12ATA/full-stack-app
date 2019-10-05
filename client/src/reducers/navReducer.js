import { SET_ACTIVE_NAV } from "../actions/types";

const initialState = {
  navItem: ""
};

export default (state = initialState, action) => {
  return action.type === SET_ACTIVE_NAV
    ? { ...state, navItem: action.navItem }
    : state;
};
