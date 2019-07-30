import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";

class Navbar extends Component {
  render() {
    return <div>{/* home of new navbar */}</div>;
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default withRouter(connect(mapStateToProps)(Navbar));
