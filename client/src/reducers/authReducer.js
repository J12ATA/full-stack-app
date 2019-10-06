import {
  SET_CURRENT_ADMIN,
  SET_CURRENT_USER,
  TOGGLE_LOGIN,
} from '../actions/types';

const isEmpty = require('is-empty');

const initialState = {
  isAuthenticated: false,
  isOpen: false,
  admin: {},
  user: {},
};

export default function (state = initialState, action) {
  const { type, payload, isOpen } = action;

  switch (type) {
    case SET_CURRENT_ADMIN:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        admin: payload,
      };
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: payload,
      };
    case TOGGLE_LOGIN:
      return {
        ...state,
        isOpen,
      };
    default:
      return state;
  }
}
