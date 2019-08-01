import React, { Component } from "react";
import "normalize.css";
import "./app.scss";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { logout } from "./actions/authActions";
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
import Products from "./components/Products";
import Users from "./components/Users";

class App extends Component {
  componentDidMount() {
    if (localStorage.jwtToken) {
      const decoded = jwt_decode(localStorage.jwtToken);
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) logout();
    }
  }

  render() {
    return (
      <Provider store={store}>
        <Router>
          <div>
            <Navbar />
            <Route exact path="/" component={Landing} />
            <Route exact path="/add_admin" component={AddAdmin} />
            <Route exact path="/add_user" component={AddUser} />
            <Route exact path="/login_admin" component={LoginAdmin} />
            <Route exact path="/login_user" component={LoginUser} />
            <Route exact path="/products" component={Products} />
            <Route exact path="/users" component={Users} />
            <Switch>
              <PrivateRoute
                exact
                path="/admin_dashboard"
                component={AdminDashboard}
              />
            </Switch>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
