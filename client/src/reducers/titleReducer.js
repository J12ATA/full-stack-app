import { SET_NAV_TITLE } from '../actions/types';

const initialState = {
  title: 'Welcome',
};

export default (state = initialState, action) => {
  const { type, title } = action;

  return type === SET_NAV_TITLE
    ? { ...state, title }
    : state;
};
