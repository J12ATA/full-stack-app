import { SET_USER_DATA } from '../actions/types';

const initialState = {
  users: [],
};

export default (state = initialState, action) => {
  const { type, users } = action;

  return type === SET_USER_DATA
    ? { ...state, users }
    : state;
};
