import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import PropTypes from "prop-types";
import { logoutAdmin, logoutUser } from "../../actions/authActions";
import MaterialIcon from "@material/react-material-icon";
import Drawer, {
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
    name: "Reviews",
    graphic: { iconName: "star", label: "reviews" }
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
    isOpen: false
  };

  onDrawerClose = () => {
    this.setState({ isOpen: false });
  };

  render() {
    const { admin, user, isAuthenticated } = this.props.auth;
    const { isOpen, activeListItem } = this.state;
    const { tokenOwner } = localStorage;
    const { onDrawerClose, setState } = this;
    let navList;

    if (!isAuthenticated) {
      navList = NAVBAR_LIST;
    } else {
      navList = tokenOwner === "User" ? USER_NAVBAR_LIST : ADMIN_NAVBAR_LIST;
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
