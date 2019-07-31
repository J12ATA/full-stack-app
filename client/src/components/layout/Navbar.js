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

class Navbar extends Component {
  state = {
    isOpen: false
  };

  render() {
    const { isOpen } = this.state;

    return (
      <div>
        <Drawer modal open={isOpen}>
          <DrawerHeader>
            <DrawerTitle tag="h2">{"MENU"}</DrawerTitle>
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
