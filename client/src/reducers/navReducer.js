import { SET_ACTIVE_NAV } from '../actions/types';

const initialState = {
  navItem: '',
};

export default (state = initialState, action) => {
  const { type, navItem } = action;

  return type === SET_ACTIVE_NAV
    ? { ...state, navItem }
    : state;
};
