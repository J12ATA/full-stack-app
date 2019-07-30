import React, { Component } from "react";
import "normalize.css";
import "./app.scss";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentAdmin, setCurrentUser, logoutUser, logoutAdmin } from "./actions/authActions";

import { Provider } from "react-redux";
import store from "./store";

import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import AddAdmin from "./components/auth/AddAdmin";
import LoginAdmin from "./components/auth/LoginAdmin";
import LoginUser from "./components/auth/LoginUser";
import AddUser from "./components/auth/AddUser";
import PrivateRoute from "./components/private-route/PrivateRoute";
import AdminDashboard from "./components/dashboard/AdminDashboard";
import UserDashboard from "./components/dashboard/UserDashboard";

if (localStorage.jwtToken && localStorage.tokenOwner === "User") {
  const token = localStorage.jwtToken;
  setAuthToken(token);
  const decoded = jwt_decode(token);
  store.dispatch(setCurrentUser(decoded));
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    store.dispatch(logoutUser());
    window.location.href = "./login_user";
  }
}

if (localStorage.jwtToken && localStorage.tokenOwner === "Admin") {
  const token = localStorage.jwtToken;
  setAuthToken(token);
  const decoded = jwt_decode(token);
  store.dispatch(setCurrentAdmin(decoded));
  const currentTime = Date.now() / 1000; 
  if (decoded.exp < currentTime) {
    store.dispatch(logoutAdmin());
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
            <Route exact path="/add_user" component={AddUser} />
            <Route exact path="/login_admin" component={LoginAdmin} />
            <Route exact path="/login_user" component={LoginUser} />
            <Switch>
              <PrivateRoute exact path="/admin_dashboard" component={AdminDashboard} />
              <PrivateRoute exact path="/user_dashboard" component={UserDashboard} />
            </Switch>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
