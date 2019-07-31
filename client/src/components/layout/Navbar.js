import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import PropTypes from "prop-types";
import { logoutAdmin, logoutUser } from "../../actions/authActions";
import Drawer, {
  DrawerContent,
  DrawerHeader,
  DrawerTitle
} from "@material/react-drawer";
import List, { ListItem, ListDivider } from "@material/react-list";

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
    const { admin, user } = this.props.auth;
    const { isOpen } = this.state;
    const { onDrawerClose } = this;

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
              <ListItem />
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
