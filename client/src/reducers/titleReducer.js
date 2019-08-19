import { SET_NAV_TITLE } from "../actions/types";

const initialState = {
  title: "Welcome"
};

export default (state = initialState, action) => {
  return action.type === SET_NAV_TITLE
    ? { ...state, title: action.title }
    : state;
};
