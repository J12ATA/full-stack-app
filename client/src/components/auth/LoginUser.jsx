import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import TextField, { HelperText, Input } from '@material/react-text-field';
import Button from '@material/react-button';
import { loginUser, logout } from '../../actions/authActions';
import setActiveNav from '../../actions/navActions';
import setNavTitle from '../../actions/titleActions';

class LoginUser extends Component {
  state = {
    email: '',
    password: '',
    errors: {},
  };

  componentDidMount() {
    const { tokenOwner } = localStorage;
    const {
      auth, activeNav, navTitle, history, resetAuth,
    } = this.props;

    if (auth.isAuthenticated && tokenOwner === 'User') {
      activeNav('Products');
      navTitle('Products');
      history.push('/products');
    } else if (!auth.isAuthenticated && tokenOwner) {
      resetAuth(tokenOwner);
    }

    activeNav('');
    navTitle('Welcome');
  }

  componentDidUpdate(prevProps) {
    const { tokenOwner } = localStorage;
    const { setErrors } = this;
    const {
      auth, activeNav, navTitle, history, errors,
    } = this.props;

    if (!Object.is(prevProps.auth, auth) && tokenOwner === 'User') {
      activeNav('Products');
      navTitle('Products');
      history.push('/products');
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

    const { signIn } = this.props;
    const { email, password } = this.state;

    const userData = { email, password };

    signIn(userData);
  };

  render() {
    const { errors, password, email } = this.state;
    const { onSubmit, onChange } = this;

    return (
      <div className="login-container">
        <h3>User</h3>
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
          <div className="login-btn">
            <Button raised>Login</Button>
          </div>
        </form>
      </div>
    );
  }
}

LoginUser.propTypes = {
  signIn: PropTypes.func.isRequired,
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
  signIn: loginUser,
  activeNav: setActiveNav,
  navTitle: setNavTitle,
  resetAuth: logout,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(LoginUser),
);
