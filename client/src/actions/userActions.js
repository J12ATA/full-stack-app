import { SET_USER_DATA } from './types';
import { getAllUserData } from '../utils/api';
import { getErrors } from './authActions';

// sync action
export const setUserData = (users) => ({
  type: SET_USER_DATA,
  users,
});

// async action creator
export const userData = () => async (dispatch) => {
  try {
    const response = await getAllUserData();
    const users = response.data;

    dispatch(setUserData(users));
  } catch (err) {
    dispatch(getErrors(err));
  }
};
