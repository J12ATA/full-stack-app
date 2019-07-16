import { SET_USER_DATA } from "../actions/types";

const initialState = {
  users: []
};

export default (state = initialState, action) => {
  return action.type === SET_USER_DATA
    ? { ...state, users: action.payload }
    : state;
};