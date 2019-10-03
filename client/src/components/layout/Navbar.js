import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import PropTypes from "prop-types";
import LoginDialog from "../auth/LoginDialog";
import { logout, setToggleLogin } from "../../actions/authActions";
import { setNavTitle } from "../../actions/titleActions";
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
    isDrawerOpen: false
  };

  componentDidMount() {
    this.handleNavTitle();
  }

  handleNavTitle = name => {
    this.setState({ activeListItem: name });
    return name ? this.props.setNavTitle(name) : "Welcome";
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
    this.onDrawerClose();
    this.toggleLoginDialog();
  };

  toggleLoginDialog = () => {
    setTimeout(() => this.props.setToggleLogin(true), 250);
  };

  onLogoutClick = () => {
    this.props.logout(localStorage.tokenOwner);
    this.onDrawerClose();
  };

  render() {
    const { admin, user, isAuthenticated } = this.props.auth;
    const { isDrawerOpen, activeListItem } = this.state;
    const {
      onDrawerClose,
      onNavBarItemClick,
      onMenuClick,
      handleNavTitle
    } = this;
    const { title } = this.props.title;
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
                        handleNavTitle(name);
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
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  title: state.title
});

const mapDispatchToProps = {
  logout,
  setToggleLogin,
  setNavTitle
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Navbar)
);
