import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { addAdmin } from "../../actions/authActions";
import { setActiveNav } from "../../actions/navActions";
import { setNavTitle } from "../../actions/titleActions";
import TextField, { HelperText, Input } from "@material/react-text-field";
import Button from "@material/react-button";

class AddAdmin extends Component {
  state = {
    name: "",
    email: "",
    password: "",
    password2: "",
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

    if (!Object.is(prevProps.errors, this.props.errors)) {
      this.setState({ errors: this.props.errors });
    }
  }

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    const adminData = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2
    };

    this.props.addAdmin(adminData, this.props.history);
  };

  render() {
    const { errors, password, password2, email, name } = this.state;
    const { onSubmit, onChange } = this;

    return (
      <div>
        <div>
          <h3>Admin</h3>
          <form noValidate onSubmit={onSubmit}>
            <div>
              <TextField
                label="Name"
                helperText={<HelperText>{errors.name}</HelperText>}
              >
                <Input
                  value={name}
                  onChange={onChange}
                  id="name"
                  type="text"
                  isValid={!errors.hasOwnProperty("name")}
                />
              </TextField>
            </div>
            <div>
              <TextField
                label="Email"
                helperText={<HelperText>{errors.email}</HelperText>}
              >
                <Input
                  value={email}
                  onChange={onChange}
                  id="email"
                  type="email"
                  isValid={!errors.hasOwnProperty("email")}
                />
              </TextField>
            </div>
            <div>
              <TextField
                label="Password"
                helperText={<HelperText>{errors.password}</HelperText>}
              >
                <Input
                  value={password}
                  onChange={onChange}
                  id="password"
                  type="password"
                  isValid={!errors.hasOwnProperty("password")}
                />
              </TextField>
            </div>
            <div>
              <TextField
                label="Confirm Password"
                helperText={<HelperText>{errors.password2}</HelperText>}
              >
                <Input
                  value={password2}
                  onChange={onChange}
                  id="password2"
                  type="password"
                  isValid={!errors.hasOwnProperty("password2")}
                />
              </TextField>
            </div>
            <div>
              <Button raised>Register</Button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

AddAdmin.propTypes = {
  addAdmin: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

const mapDispatchToProps = {
  addAdmin,
  setActiveNav,
  setNavTitle
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AddAdmin)
);
