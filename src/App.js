import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentAdmin, setCurrentReviewer, logoutReviewer, logoutAdmin } from "./actions/authActions";

import { Provider } from "react-redux";
import store from "./store";

import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import AddAdmin from "./components/auth/AddAdmin";
import LoginAdmin from "./components/auth/LoginAdmin";
import LoginReviewer from "./components/auth/LoginReviewer";
import AddReviewer from "./components/auth/AddReviewer";
import PrivateRoute from "./components/private-route/PrivateRoute";
import AdminDashboard from "./components/dashboard/AdminDashboard";
import ReviewerDashboard from "./components/dashboard/ReviewerDashboard";

// Check for token to keep reviewer logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);
  //Decode token and get reviewer info and exp
  const decoded = jwt_decode(token);
  // Set reviewer and isAuthenticated
  store.dispatch(setCurrentReviewer(decoded));

  // Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout reviewer
    store.dispatch(logoutReviewer());

    // Redirect to reviewer login
    window.location.href = "./login_reviewer";
  }
}

// Check for token to keep admin logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);
  // Decode token and get admin info and exp
  const decoded = jwt_decode(token);
  // Set admin and isAuthenticated
  store.dispatch(setCurrentAdmin(decoded));

  // Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout admin
    store.dispatch(logoutAdmin());

    // Redirect to admin login
    window.location.href = "./login_admin";
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />
            <Route exact path="/" component={Landing} />
            <Route exact path="/add_admin" component={AddAdmin} />
            <Route exact path="/add_reviewer" component={AddReviewer} />
            <Route exact path="/login_admin" component={LoginAdmin} />
            <Route exact path="/login_reviewer" component={LoginReviewer} />
            <Switch>
              <PrivateRoute exact path="/admin_dashboard" component={AdminDashboard} />
              <PrivateRoute exact path="/reviewer_dashboard" component={ReviewerDashboard} />
            </Switch>
          </div>
        </Router>
      </Provider>
    );
  }
}
export default App;
