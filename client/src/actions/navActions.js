import { SET_ACTIVE_NAV } from './types';

const setActiveNav = (location) => ({
  type: SET_ACTIVE_NAV,
  navItem: location,
});

export default setActiveNav;
