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
// import AddAdmin from "./components/auth/AddAdmin";
// import LoginAdmin from "./components/auth/LoginAdmin";
// import LoginUser from "./components/auth/LoginUser";
// import AddUser from "./components/auth/AddUser";
import PrivateRoute from "./components/private-route/PrivateRoute";
// import Dashboard from "./components/dashboard/Dashboard";
// import Products from "./components/Products";
// import Users from "./components/Users";
import Page404 from "./components/layout/Page404";

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
          <Navbar />
          <Switch>
            <Route exact path="/" component={Landing} />
            <Route exact path="/add_admin" component={Landing} />
            <Route exact path="/add_user" component={Landing} />
            <Route exact path="/login_admin" component={Landing} />
            <Route exact path="/login_user" component={Landing} />
            <Route exact path="/products" component={Landing} />
            <Route exact path="/users" component={Landing} />
            <Route component={Page404} />
            <PrivateRoute exact path="/dashboard" component={Landing} />
          </Switch>
        </Router>
      </Provider>
    );
  }
}

export default App;
