import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import PropTypes from "prop-types";
import LoginDialog from "../auth/LoginDialog";
import { logout, setToggleLogin } from "../../actions/authActions";
import MaterialIcon from "@material/react-material-icon";
import Drawer, {
  DrawerAppContent,
  DrawerContent,
  DrawerHeader,
  DrawerTitle
} from "@material/react-drawer";
import List, {
  ListItem,
  ListDivider,
  ListItemGraphic,
  ListItemText
} from "@material/react-list";
import TopAppBar, {
  TopAppBarFixedAdjust,
  TopAppBarIcon,
  TopAppBarRow,
  TopAppBarSection,
  TopAppBarTitle
} from "@material/react-top-app-bar";

const startList = [
  {
    name: "Products",
    graphic: { iconName: "shopping_cart", label: "products" }
  },
  {
    name: "Users",
    graphic: { iconName: "people", label: "users" }
  }
];

const endList = [
  {
    name: "Logout",
    graphic: { iconName: "exit_to_app", label: "logout" }
  }
];

const USER_NAVBAR_LIST = [...startList, ...endList];

const ADMIN_NAVBAR_LIST = [
  ...startList,
  {
    name: "Dashboard",
    graphic: { iconName: "dashboard", label: "dashboard" }
  },
  ...endList
];

const NAVBAR_LIST = [
  ...startList,
  {
    name: "Login",
    graphic: { iconName: "vpn_key", label: "login" }
  }
];

class Navbar extends Component {
  state = {
    activeListItem: "",
    isDrawerOpen: false,
    navTitle: ""
  };

  componentDidMount() {
    this.handleNavTitle();
  }

  handleNavTitle = () => {
    const errorTitle = "Error 404: Page Not Found";
    const path = this.props.history.location.pathname;
    const route = `${path.match(/^\/\w+\/?\w+/)}`;
    const slashCount = (route.match(/\//g) || []).length;

    if (path.match(/^\/$/)) return this.setState({ navTitle: "Welcome" });

    if (slashCount === 2) {
      let rootRoute = `${route.match(/^\/\w+/)}`;
      let subRoute = `${route.match(/\/\w+$/)}`;
      rootRoute = `${rootRoute[1].toUpperCase()}${rootRoute.slice(2)}`;
      subRoute = subRoute.slice(1);
      return rootRoute.match(/^(Products|Users|Dashboard)$/)
        ? this.setState({
            navTitle: subRoute,
            activeListItem: rootRoute
          })
        : this.setState({ navTitle: errorTitle });
    }

    if (route.length) {
      const titleToReturn = `${route[1].toUpperCase()}${route.slice(2)}`;
      return route.match(/^\/(products|users|dashboard)$/)
        ? this.setState({
            navTitle: titleToReturn,
            activeListItem: titleToReturn
          })
        : this.setState({ navTitle: errorTitle });
    }
  };

  onDrawerClose = () => {
    this.setState({ isDrawerOpen: false });
  };

  onMenuClick = () => {
    this.setState({ isDrawerOpen: true });
  };

  onNavBarItemClick = name => {
    switch (name) {
      case "Products":
        return this.onProductsClick();
      case "Users":
        return this.onUsersClick();
      case "Dashboard":
        return this.onDashboardClick();
      case "Logout":
        return this.onLogoutClick();
      case "Login":
        return this.onLoginClick();
      default:
        return this.onDrawerClose();
    }
  };

  onProductsClick = () => {
    this.props.history.push("/products");
    this.onDrawerClose();
  };

  onUsersClick = () => {
    this.props.history.push("/users");
    this.onDrawerClose();
  };

  onDashboardClick = () => {
    this.props.history.push("/admin_dashboard");
    this.onDrawerClose();
  };

  onLoginClick = () => {
    this.props.setToggleLogin(true);
    this.onDrawerClose();
  };

  onLogoutClick = () => {
    this.setState({ navTitle: "Welcome" });
    this.props.logout(localStorage.tokenOwner);
    this.onDrawerClose();
  };

  render() {
    const { admin, user, isAuthenticated } = this.props.auth;
    const { isDrawerOpen, activeListItem, navTitle } = this.state;
    const { onDrawerClose, onNavBarItemClick, onMenuClick } = this;
    let navList;

    if (!isAuthenticated) {
      navList = NAVBAR_LIST;
    } else {
      navList =
        localStorage.tokenOwner === "User"
          ? USER_NAVBAR_LIST
          : ADMIN_NAVBAR_LIST;
    }

    return (
      <div>
        <Drawer modal open={isDrawerOpen} onClose={onDrawerClose}>
          <DrawerHeader>
            <DrawerTitle tag="h2">
              {admin.name || user.name || "MENU"}
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
                      if (name !== "Login" && name !== "logout")
                        this.setState({
                          activeListItem: name,
                          navTitle: name
                        });
                      onNavBarItemClick(name);
                    }}
                    activated={activeListItem === name}
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
                <TopAppBarTitle>{navTitle}</TopAppBarTitle>
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
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

const mapDispatchToProps = {
  logout,
  setToggleLogin
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Navbar)
);
