import { SET_ACTIVE_NAV } from './types';

export const setActiveNav = location => ({
  type: SET_ACTIVE_NAV,
  navItem: location
});
