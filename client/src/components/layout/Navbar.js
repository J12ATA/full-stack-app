import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import PropTypes from "prop-types";
import { logoutAdmin, logoutUser } from "../../actions/authActions";

class Navbar extends Component {
  render() {
    return <div>{/* home of new navbar */}</div>;
  }
}

Navbar.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

const mapDispatchToProps = dispatch => ({
  logoutAdmin: () => dispatch(logoutAdmin()),
  logoutUser: () => dispatch(logoutUser())
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Navbar)
);
