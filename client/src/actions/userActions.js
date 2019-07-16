import { GET_ERRORS, SET_USER_DATA } from "./types";
import { getAllUserData } from "../utils/api";

// async action creator
export const userData = () => async dispatch => {
  debugger;

  try {
    const response = await getAllUserData();
    const users = response.data;

    dispatch(setUserData(users));
  } catch(err) {
    dispatch({ type: GET_ERRORS, payload: {} })
  }
};

// sync action
export const setUserData = users => ({
  type: SET_USER_DATA, payload: users
});

