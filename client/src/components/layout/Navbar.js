import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import PropTypes from "prop-types";

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

export default withRouter(connect(mapStateToProps)(Navbar));
