import { SET_NAV_TITLE } from './types';

const setNavTitle = (location) => ({
  type: SET_NAV_TITLE,
  title: location,
});

export default setNavTitle;
