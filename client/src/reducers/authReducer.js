import { SET_CURRENT_ADMIN, SET_CURRENT_USER, ADMIN_LOADING, USER_LOADING } from "../actions/types";

const isEmpty = require("is-empty");

const initialState = {
  isAuthenticated: false,
  admin: {},
  user: {},
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_ADMIN:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        admin: action.payload
      };
    case ADMIN_LOADING:
      return {
        ...state,
        loading: true
      };
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload
      };
    case USER_LOADING:
      return {
        ...state,
        loading: true
      };
    default:
      return state;
  }
}
