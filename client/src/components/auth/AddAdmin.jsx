import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import TextField, { HelperText, Input } from '@material/react-text-field';
import Button from '@material/react-button';
import { addAdmin, logout } from '../../actions/authActions';
import setActiveNav from '../../actions/navActions';
import setNavTitle from '../../actions/titleActions';

class AddAdmin extends Component {
  state = {
    name: '',
    email: '',
    password: '',
    password2: '',
    errors: {},
  };

  componentDidMount() {
    const { tokenOwner } = localStorage;
    const {
      auth, activeNav, navTitle, history, resetAuth,
    } = this.props;

    if (auth.isAuthenticated && tokenOwner === 'Admin') {
      activeNav('Dashboard');
      navTitle('Dashboard');
      history.push('/dashboard');
    } else if (!auth.isAuthenticated && tokenOwner) {
      resetAuth(tokenOwner);
    }

    setActiveNav('');
    setNavTitle('Welcome');
  }

  componentDidUpdate(prevProps) {
    const { tokenOwner } = localStorage;
    const { setErrors } = this;
    const {
      auth, activeNav, navTitle, history, errors,
    } = this.props;

    if (!Object.is(prevProps.auth, auth) && tokenOwner === 'Admin') {
      activeNav('Dashboard');
      navTitle('Dashboard');
      history.push('/dashboard');
    }

    if (!Object.is(prevProps.errors, errors)) {
      setErrors(errors);
    }
  }

  setErrors = (errors) => {
    this.setState({ errors });
  };

  onChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onSubmit = (e) => {
    e.preventDefault();

    const { newAdmin, history } = this.props;
    const {
      name, email, password, password2,
    } = this.state;

    const adminData = {
      name, email, password, password2,
    };

    newAdmin(adminData, history);
  };

  render() {
    const {
      errors, password, password2, email, name,
    } = this.state;
    const { onSubmit, onChange } = this;

    return (
      <div className="login-container">
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
                isValid={!Object.prototype.hasOwnProperty.call(errors, 'name')}
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
                isValid={!Object.prototype.hasOwnProperty.call(errors, 'email')}
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
                isValid={!Object.prototype.hasOwnProperty.call(errors, 'password')}
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
                isValid={!Object.prototype.hasOwnProperty.call(errors, 'password2')}
              />
            </TextField>
          </div>
          <div className="register-btn">
            <Button raised>Register</Button>
          </div>
        </form>
      </div>
    );
  }
}

AddAdmin.propTypes = {
  newAdmin: PropTypes.func.isRequired,
  resetAuth: PropTypes.func.isRequired,
  activeNav: PropTypes.func.isRequired,
  navTitle: PropTypes.func.isRequired,
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
  auth: PropTypes.shape({
    isAuthenticated: PropTypes.bool,
    isOpen: PropTypes.bool,
    admin: PropTypes.object,
    user: PropTypes.object,
  }).isRequired,
  errors: PropTypes.shape({}).isRequired,
};

const mapStateToProps = ({ auth, errors }) => ({ auth, errors });

const mapDispatchToProps = {
  newAdmin: addAdmin,
  resetAuth: logout,
  activeNav: setActiveNav,
  navTitle: setNavTitle,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(AddAdmin),
);
