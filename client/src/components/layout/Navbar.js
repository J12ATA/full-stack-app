import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import PropTypes from "prop-types";
import { logoutAdmin, logoutUser } from "../../actions/authActions";
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
    activeListItem: null,
    isOpen: false
  };

  onDrawerClose = () => {
    this.setState({ isOpen: false });
  };

  onMenuClick = () => {
    this.setState({ isOpen: true });
  };

  onNavBarItemClick = name => {
    switch (name) {
      case "Products":
        this.onProductsClick();
        break;
      case "Users":
        this.onUsersClick();
        break;
      case "Dashboard":
        this.onDashboardClick();
        break;
      case "Logout":
        this.onLogoutClick();
        break;
      default:
        this.onDrawerClose();
    }
  };

  onProductsClick = () => {
    this.props.history.push(this.props.history.location);
    this.props.history.push("/products");
    this.onDrawerClose();
  };

  onUsersClick = () => {
    this.props.history.push(this.props.history.location);
    this.props.history.push("/users");
    this.onDrawerClose();
  };

  onDashboardClick = () => {
    this.props.history.push(this.props.location);
    this.props.history.push("/admin_dashboard");
    this.onDrawerClose();
  };

  onLogoutClick = () => {
    this.logoutUser();
    this.logoutAdmin();
    this.onDrawerClose();
  };

  render() {
    const { admin, user, isAuthenticated } = this.props.auth;
    const { isOpen, activeListItem } = this.state;
    const { onDrawerClose, setState, onNavBarItemClick, onMenuClick } = this;
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
        <Drawer modal open={isOpen} onClose={onDrawerClose}>
          <DrawerHeader>
            <DrawerTitle tag="h2">
              {admin.name || user.name || "MENU"}
            </DrawerTitle>
          </DrawerHeader>
          <DrawerContent>
            <ListDivider tag="div" />
            <List>
              {navList.map(({ name, graphic }, i = 0) => {
                const { iconName, label } = graphic;
                return (
                  <ListItem
                    key={name}
                    onClick={() => {
                      setState({ activeListItem: name });
                      onNavBarItemClick(name);
                    }}
                    activated={activeListItem === name}
                  >
                    <ListItemGraphic
                      graphic={
                        <MaterialIcon icon={iconName} aria-label={label} />
                      }
                    />
                    <ListItemText tabIndex={i++} primaryText={name} />
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
                <TopAppBarTitle>{activeListItem || "WELCOME"}</TopAppBarTitle>
              </TopAppBarSection>
            </TopAppBarRow>
          </TopAppBar>
          <TopAppBarFixedAdjust />
        </DrawerAppContent>
      </div>
    );
  }
}

Navbar.propTypes = {
  logoutAdmin: PropTypes.func.isRequired,
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

const mapDispatchToProps = dispatch => ({
  logoutAdmin: () => dispatch(logoutAdmin()),
  logoutUser: () => dispatch(logoutUser())
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Navbar)
);
