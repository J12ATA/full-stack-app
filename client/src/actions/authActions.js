import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

import { GET_ERRORS, SET_CURRENT_ADMIN, SET_CURRENT_USER } from "./types";

const BASE_URL = "http://35.232.153.179/api";

export const addAdmin = (userData, history) => dispatch => {
  axios.post(`${BASE_URL}/admin/add_admin`, userData).then(res => 
    history.push("/login_admin")
  ).catch(err => 
    dispatch({ type: GET_ERRORS, payload: err.response.data })
  );
};

export const addUser = (userData, history) => dispatch => {
  axios.post(`${BASE_URL}/users/add_user`, userData).then(res => 
    history.push("/login_user")
  ).catch(err =>
    dispatch({ type: GET_ERRORS, payload: err.response.data })
  );
};

export const loginAdmin = userData => dispatch => {
  axios.post(`${BASE_URL}/admin/login_admin`, userData).then(res => {
    const { token } = res.data;
    localStorage.setItem("jwtToken", token);
    localStorage.setItem("tokenOwner", "Admin");
    setAuthToken(token);
    const decoded = jwt_decode(token);
    dispatch(setCurrentAdmin(decoded));
  }).catch(err =>
    dispatch({ type: GET_ERRORS, payload: err.response.data })
  );
};

export const loginUser = userData => dispatch => {
  axios.post(`${BASE_URL}/users/login_user`, userData).then(res => {
    const { token } = res.data;
    localStorage.setItem("jwtToken", token);
    localStorage.setItem("tokenOwner", "User");
    setAuthToken(token);
    const decoded = jwt_decode(token);
    dispatch(setCurrentUser(decoded));
  }).catch(err =>
    dispatch({ type: GET_ERRORS, payload: err.response.data })
  );
};

export const setCurrentAdmin = decoded => ({ 
  type: SET_CURRENT_ADMIN, payload: decoded 
});

export const setCurrentUser = decoded => ({
  type: SET_CURRENT_USER, payload: decoded
});

export const logoutAdmin = () => dispatch => {
  localStorage.removeItem("jwtToken");
  localStorage.removeItem("tokenOwner");
  setAuthToken(false);
  dispatch(setCurrentAdmin({}));
};

export const logoutUser = () => dispatch => {
  localStorage.removeItem("jwtToken");
  localStorage.removeItem("tokenOwner");
  setAuthToken(false);
  dispatch(setCurrentUser({}));
}