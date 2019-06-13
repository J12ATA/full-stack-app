import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

import { GET_ERRORS, SET_CURRENT_ADMIN, ADMIN_LOADING, REVIEWER_LOADING, SET_CURRENT_REVIEWER } from "./types";

// Register Admin
export const addAdmin = (userData, history) => dispatch => {
  axios
    .post("/api/add_admin", userData)
    .then(res => history.push("/login_admin")) // re-direct to login on successful admin registration
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// AddReviewer
export const addReviewer = (userData, history) => dispatch => {
  axios
    .post("/api/add_reviewer", userData)
    .then(res => history.push("/login_reviewer")) //re-direct to users on successful reviewer registration
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Login - get admin token
export const loginAdmin = userData => dispatch => {
  axios
    .post("/api/login_admin", userData)
    .then(res => {
      // Save to localStorage

      // Set token to localStorage
      const { token } = res.data;
      localStorage.setItem("jwtToken", token);
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get admin data
      const decoded = jwt_decode(token);
      // Set current admin
      dispatch(setCurrentAdmin(decoded));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// LoginReviewer - get reviewer token
export const loginReviewer = userData => dispatch => {
  axios
    .post("/api/login_reviewer", userData)
    .then(res => {
      // Save to localStorage

      // Set token to localStorage
      const { token } = res.data;
      localStorage.setItem("jwtToken", token);
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get reviewer data
      const decoded = jwt_decode(token);
      // Set current reviewer
      dispatch(setCurrentReviewer(decoded));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Set logged in admin
export const setCurrentAdmin = decoded => {
  return {
    type: SET_CURRENT_ADMIN,
    payload: decoded
  };
};

// Set logged in reviewer
export const setCurrentReviewer = decoded => {
  return {
    type: SET_CURRENT_REVIEWER,
    payload: decoded
  };
};

// Admin loading
export const setAdminLoading = () => {
  return {
    type: ADMIN_LOADING
  };
};

// Reviewer loading
export const setReviewerLoading = () => {
  return {
    type: REVIEWER_LOADING
  };
};

// Log admin out
export const logoutAdmin = () => dispatch => {
  // Remove token from local storage
  localStorage.removeItem("jwtToken");
  // Remove auth header for future requests
  setAuthToken(false);
  // Set current admin to empty object {} which will set isAuthenticated to false
  dispatch(setCurrentAdmin({}));
};

// Log reviewer out
export const logoutReviewer = () => dispatch => {
  // Remove token from local storage
  localStorage.removeItem("jwtToken");
  // Remove auth header for future requests
  setAuthToken(false);
  // Set current reviewer to empty object {} which will set isAuthenticated to false
  dispatch(setCurrentReviewer({}));
}