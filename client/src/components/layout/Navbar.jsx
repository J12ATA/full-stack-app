import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import MaterialIcon from '@material/react-material-icon';
import Drawer, {
  DrawerAppContent,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@material/react-drawer';
import List, {
  ListItem,
  ListDivider,
  ListItemGraphic,
  ListItemText,
} from '@material/react-list';
import TopAppBar, {
  TopAppBarFixedAdjust,
  TopAppBarIcon,
  TopAppBarRow,
  TopAppBarSection,
  TopAppBarTitle,
} from '@material/react-top-app-bar';
import LoginDialog from '../auth/LoginDialog';
import { logout, setToggleLogin } from '../../actions/authActions';
import setNavTitle from '../../actions/titleActions';
import setActiveNav from '../../actions/navActions';

const startList = [
  {
    name: 'Products',
    graphic: { iconName: 'shopping_cart', label: 'products' },
  },
  {
    name: 'Users',
    graphic: { iconName: 'people', label: 'users' },
  },
];

const endList = [
  {
    name: 'Logout',
    graphic: { iconName: 'exit_to_app', label: 'logout' },
  },
];

const USER_NAVBAR_LIST = [...startList, ...endList];

const ADMIN_NAVBAR_LIST = [
  ...startList,
  {
    name: 'Dashboard',
    graphic: { iconName: 'dashboard', label: 'dashboard' },
  },
  ...endList,
];

const NAVBAR_LIST = [
  ...startList,
  {
    name: 'Login',
    graphic: { iconName: 'vpn_key', label: 'login' },
  },
];

class Navbar extends Component {
  state = {
    isDrawerOpen: false,
  };

  componentDidMount() {
    this.handleNavTitle();
  }

  handleNavTitle = (name) => {
    const { activeNav, navTitle } = this.props;

    if (name) activeNav(name);
    navTitle(name || 'Welcome');
  };

  onDrawerClose = () => {
    this.setState({ isDrawerOpen: false });
  };

  onMenuClick = () => {
    this.setState({ isDrawerOpen: true });
  };

  onNavBarItemClick = (name) => {
    switch (name) {
      case 'Products':
        return this.onProductsClick();
      case 'Users':
        return this.onUsersClick();
      case 'Dashboard':
        return this.onDashboardClick();
      case 'Logout':
        return this.onLogoutClick();
      case 'Login':
        return this.onLoginClick();
      default:
        return this.onDrawerClose();
    }
  };

  onProductsClick = () => {
    const { history } = this.props;
    const { onDrawerClose } = this;

    history.push('/products');
    onDrawerClose();
  };

  onUsersClick = () => {
    const { history } = this.props;
    const { onDrawerClose } = this;

    history.push('/users');
    onDrawerClose();
  };

  onDashboardClick = () => {
    const { history } = this.props;
    const { onDrawerClose } = this;

    history.push('/dashboard');
    onDrawerClose();
  };

  onLoginClick = () => {
    const { onDrawerClose, toggleLoginDialog } = this;

    onDrawerClose();
    toggleLoginDialog();
  };

  toggleLoginDialog = () => {
    const { isLogin } = this.props;

    setTimeout(() => isLogin(true), 250);
  };

  onLogoutClick = () => {
    const { tokenOwner } = localStorage;
    const { onDrawerClose } = this;
    const {
      resetAuth, activeNav, navTitle, history,
    } = this.props;

    resetAuth(tokenOwner);
    activeNav('');
    navTitle('Welcome');
    history.push('/');
    onDrawerClose();
  };

  render() {
    const { auth, title, navItem } = this.props;
    const { admin, user, isAuthenticated } = auth;
    const {
      onDrawerClose,
      onNavBarItemClick,
      onMenuClick,
      handleNavTitle,
    } = this;
    const { isDrawerOpen } = this.state;
    let navList;

    if (!isAuthenticated) {
      navList = NAVBAR_LIST;
    } else {
      navList = localStorage.tokenOwner === 'User'
        ? USER_NAVBAR_LIST
        : ADMIN_NAVBAR_LIST;
    }

    return (
      <div>
        <Drawer modal open={isDrawerOpen} onClose={onDrawerClose}>
          <DrawerHeader>
            <DrawerTitle tag="h2">
              {admin.name || user.name || 'MENU'}
            </DrawerTitle>
          </DrawerHeader>
          <DrawerContent>
            <ListDivider tag="div" />
            <List>
              {navList.map(({ name, graphic }, i) => {
                const { iconName, label } = graphic;
                return (
                  <ListItem
                    key={name}
                    onClick={() => {
                      if (name !== 'Login' && name !== 'Logout') { handleNavTitle(name); }
                      onNavBarItemClick(name);
                    }}
                    activated={navItem === name}
                  >
                    <ListItemGraphic
                      graphic={
                        <MaterialIcon icon={iconName} aria-label={label} />
                      }
                    />
                    <ListItemText tabIndex={i} primaryText={name} />
                  </ListItem>
                );
              })}
            </List>
          </DrawerContent>
        </Drawer>
        <DrawerAppContent>
          <TopAppBar fixed>
            <TopAppBarRow>
              <TopAppBarSection>
                <TopAppBarIcon navIcon tabIndex={0}>
                  <MaterialIcon
                    hasRipple
                    icon="menu"
                    aria-label="menu"
                    onClick={onMenuClick}
                  />
                </TopAppBarIcon>
                <TopAppBarTitle>{title}</TopAppBarTitle>
              </TopAppBarSection>
            </TopAppBarRow>
          </TopAppBar>
          <TopAppBarFixedAdjust />
          <LoginDialog />
        </DrawerAppContent>
      </div>
    );
  }
}

Navbar.propTypes = {
  resetAuth: PropTypes.func.isRequired,
  isLogin: PropTypes.func.isRequired,
  activeNav: PropTypes.func.isRequired,
  navTitle: PropTypes.func.isRequired,
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
  auth: PropTypes.shape({
    isAuthenticated: PropTypes.bool,
    isOpen: PropTypes.bool,
    admin: PropTypes.object,
    user: PropTypes.object,
  }).isRequired,
  title: PropTypes.string.isRequired,
  navItem: PropTypes.string.isRequired,
};

const mapStateToProps = ({ auth, title, navItem }) => ({
  auth,
  title: title.title,
  navItem: navItem.navItem,
});

const mapDispatchToProps = {
  resetAuth: logout,
  isLogin: setToggleLogin,
  navTitle: setNavTitle,
  activeNav: setActiveNav,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Navbar),
);
