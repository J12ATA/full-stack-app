import React, { Component } from "react";
import "normalize.css";
import "./app.scss";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import {
  setCurrentAdmin,
  setCurrentUser,
  logoutUser,
  logoutAdmin
} from "./actions/authActions";

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

class App extends Component {
  componentDidMount() {
    const { jwtToken, tokenOwner } = localStorage;

    if (jwtToken) {
      const decoded = jwt_decode(jwtToken);
      const currentTime = Date.now() / 1000;

      setAuthToken(jwtToken);

      tokenOwner === "Admin"
        ? store.dispatch(setCurrentAdmin(decoded))
        : store.dispatch(setCurrentUser(decoded));

      if (decoded.exp < currentTime) {
        store.dispatch(logoutAdmin());
        store.dispatch(logoutUser());
      }
    }
  }

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
              <PrivateRoute
                exact
                path="/admin_dashboard"
                component={AdminDashboard}
              />
              <PrivateRoute
                exact
                path="/user_dashboard"
                component={UserDashboard}
              />
            </Switch>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
