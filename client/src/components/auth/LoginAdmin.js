import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { loginAdmin, logout } from "../../actions/authActions";
import { setActiveNav } from "../../actions/navActions";
import { setNavTitle } from "../../actions/titleActions";
import classnames from "classnames";

class LoginAdmin extends Component {
  state = {
    email: "",
    password: "",
    errors: {}
  };

  componentDidMount() {
    if (
      this.props.auth.isAuthenticated &&
      localStorage.tokenOwner === "Admin"
    ) {
      this.props.setActiveNav("Dashboard");
      this.props.setNavTitle("Dashboard");
      this.props.history.push("/dashboard");
    } else if (!this.props.auth.isAuthenticated && localStorage.tokenOwner) {
      this.props.logout(localStorage.tokenOwner);
    }
    
    this.props.setActiveNav("");
    this.props.setNavTitle("Welcome");
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.auth.isAuthenticated !== this.props.auth.isAuthenticated &&
      localStorage.tokenOwner === "Admin"
    ) {
      this.props.setActiveNav("Dashboard");
      this.props.setNavTitle("Dashboard");
      this.props.history.push("/dashboard");
    }

    if (
      Object.entries(prevProps.errors).length !==
      Object.entries(this.props.errors).length
    ) {
      this.setState({ errors: this.props.errors });
    }
  }

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    const userData = {
      email: this.state.email,
      password: this.state.password
    };

    this.props.loginAdmin(userData);
  };

  render() {
    const { errors } = this.state;

    return (
      <div className="container">
        <div style={{ marginTop: "4rem" }} className="row">
          <div className="col s8 offset-s2">
            <Link to="/" className="btn-flat waves-effect">
              <i className="material-icons left">keyboard_backspace</i>
              Back to Home
            </Link>
            <div className="col s12" style={{ paddingLeft: "11.250px" }}>
              <h4>
                <b>Login Admin</b>
              </h4>
              <p className="grey-text text-darken-1">
                Don't have an Admin account?{" "}
                <Link to="/add_admin">Register</Link>
              </p>
            </div>
            <form noValidate onSubmit={this.onSubmit}>
              <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.email}
                  error={errors.email}
                  id="email"
                  type="email"
                  className={classnames("", {
                    invalid: errors.email || errors.emailnotfound
                  })}
                />
                <label htmlFor="email">Email</label>
                <span className="red-text">
                  {errors.email}
                  {errors.emailnotfound}
                </span>
              </div>
              <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.password}
                  error={errors.password}
                  id="password"
                  type="password"
                  className={classnames("", {
                    invalid: errors.password || errors.passwordincorrect
                  })}
                />
                <label htmlFor="password">Password</label>
                <span className="red-text">
                  {errors.password}
                  {errors.passwordincorrect}
                </span>
              </div>
              <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                <button
                  style={{
                    width: "150px",
                    borderRadius: "3px",
                    letterSpacing: "1.5px",
                    marginTop: "1rem"
                  }}
                  type="submit"
                  className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

LoginAdmin.propTypes = {
  loginAdmin: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

const mapDispatchToProps = {
  loginAdmin,
  setActiveNav,
  setNavTitle,
  logout
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(LoginAdmin)
);
