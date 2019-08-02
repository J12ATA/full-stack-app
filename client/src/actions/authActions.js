import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

import {
  GET_ERRORS,
  GET_LOGIN_DATA,
  SET_CURRENT_ADMIN,
  SET_CURRENT_USER,
  TOGGLE_LOGIN
} from "./types";

const BASE_URL = "http://localhost:5000/api";

export const addAdmin = (userData, history) => dispatch => {
  axios
    .post(`${BASE_URL}/admin/add_admin`, userData)
    .then(res => history.push("/login_admin"))
    .catch(err => dispatch(getErrors(err)));
};

export const addUser = (userData, history) => dispatch => {
  axios
    .post(`${BASE_URL}/users/add_user`, userData)
    .then(res => history.push("/login_user"))
    .catch(err => dispatch(getErrors(err)));
};

export const loginAdmin = userData => dispatch => {
  axios
    .post(`${BASE_URL}/admin/login_admin`, userData)
    .then(res => {
      const { token } = res.data;
      localStorage.setItem("jwtToken", token);
      localStorage.setItem("tokenOwner", "Admin");
      setAuthToken(token);
      const decoded = jwt_decode(token);
      dispatch(setCurrentAdmin(decoded));
    })
    .catch(err => dispatch(getErrors(err)));
};

export const loginUser = loginData => dispatch => {
  dispatch(getLoginData(loginData));
  axios
    .post(`${BASE_URL}/users/login_user`, loginData)
    .then(res => {
      const { token } = res.data;
      const decoded = jwt_decode(token);
      localStorage.setItem("jwtToken", token);
      localStorage.setItem("tokenOwner", "User");
      setAuthToken(token);
      dispatch(setCurrentUser(decoded));
    })
    .catch(err => dispatch(getErrors(err)));
};

export const logout = tokenOwner => dispatch => {
  localStorage.removeItem("jwtToken");
  localStorage.removeItem("tokenOwner");
  setAuthToken(false);
  tokenOwner === "Admin"
    ? dispatch(setCurrentAdmin({}))
    : dispatch(setCurrentUser({}));
};

export const getLoginData = loginData => ({
  type: GET_LOGIN_DATA,
  loginData
});

export const getErrors = err => ({
  type: GET_ERRORS,
  errors: err.response.data
});

export const setCurrentAdmin = decoded => ({
  type: SET_CURRENT_ADMIN,
  payload: decoded
});

export const setCurrentUser = decoded => ({
  type: SET_CURRENT_USER,
  payload: decoded
});

export const setToggleLogin = isOpen => ({
  type: TOGGLE_LOGIN,
  isOpen
});
