import { SET_NAV_TITLE } FROM "./types";

export const setNavTitle = location => ({
  type: SET_NAV_TITLE,
  title: location
});