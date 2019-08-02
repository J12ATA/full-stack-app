import {
  SET_CURRENT_ADMIN,
  SET_CURRENT_USER,
  TOGGLE_LOGIN
} from "../actions/types";

const isEmpty = require("is-empty");

const initialState = {
  isAuthenticated: false,
  isOpen: false,
  admin: {},
  user: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_ADMIN:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        admin: action.payload
      };
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload
      };
    case TOGGLE_LOGIN:
      return {
        ...state,
        isOpen: action.isOpen
      };
    default:
      return state;
  }
}
