import { SET_NAV_TITLE } from './types';

export const setNavTitle = location => ({
  type: SET_NAV_TITLE,
  title: location
});
