import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { loginAdmin, logout } from '../../actions/authActions';
import { setActiveNav } from '../../actions/navActions';
import { setNavTitle } from '../../actions/titleActions';
import TextField, { HelperText, Input } from '@material/react-text-field';
import Button from '@material/react-button';

class LoginAdmin extends Component {
  state = {
    email: '',
    password: '',
    errors: {}
  };

  componentDidMount() {
    if (
      this.props.auth.isAuthenticated &&
      localStorage.tokenOwner === 'Admin'
    ) {
      this.props.setActiveNav('Dashboard');
      this.props.setNavTitle('Dashboard');
      this.props.history.push('/dashboard');
    } else if (!this.props.auth.isAuthenticated && localStorage.tokenOwner) {
      this.props.logout(localStorage.tokenOwner);
    }

    this.props.setActiveNav('');
    this.props.setNavTitle('Welcome');
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.auth.isAuthenticated &&
      localStorage.tokenOwner === 'Admin'
    ) {
      this.props.setActiveNav('Dashboard');
      this.props.setNavTitle('Dashboard');
      this.props.history.push('/dashboard');
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
      email: this.state.email,
      password: this.state.password
    };

    this.props.loginAdmin(adminData);
  };

  render() {
    const { errors, password, email } = this.state;
    const { onSubmit, onChange } = this;

    return (
      <div>
        <div>
          <h3>Admin</h3>
          <form noValidate onSubmit={onSubmit}>
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
                  isValid={!errors.hasOwnProperty('email')}
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
                  isValid={!errors.hasOwnProperty('password')}
                />
              </TextField>
            </div>
            <div>
              <Button raised>Login</Button>
            </div>
          </form>
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
