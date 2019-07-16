import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutAdmin } from "../../actions/authActions";
import { userData } from "../../actions/userActions";
import { createNewUser } from '../../utils/api';
import MaterialTable from "material-table";
import LoadingDashboard from "./loadingDashboard";

const COLUMNS = [
  { title: "Name", field: "name" },
  { title: "Email", field: "email" },
  { title: "Reviews", field: "reviewCount", editable: "never", hidden: false },
  { 
    title: "Password", field: "password", hidden: true },
  { title: "Confirm Password", field: "password2", hidden: true }
];

class AdminDashboard extends Component {
  /*
  handle data from out endpoint here:
  fields: name, email, reviewsCount, reviews

  lets nest the actual reviews *maybe*

  for certain, we will have 3 columns:
  name, email, reviews (total num of reviews)

  */

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.loadUserData();
  };

  addNewUser = async user => {
    COLUMNS[2].hidden = true;
    COLUMNS[3].hidden = false;
    COLUMNS[4].hidden = false;

    await createNewUser({ ...user });

    COLUMNS[2].hidden = false;
    COLUMNS[3].hidden = true;
    COLUMNS[4].hidden = true;

    this.props.loadUserData();

    return Promise.resolve();
  };

  updateUser = user => {
    COLUMNS[2].hidden = true;
    COLUMNS[3].hidden = false;
    COLUMNS[4].hidden = false;

    console.log('update', user);

    COLUMNS[2].hidden = false;
    COLUMNS[3].hidden = true;
    COLUMNS[4].hidden = true;
    return Promise.resolve();
  };

  deleteUser = user => {
    console.log('delete', user);
    return Promise.resolve();
  };

  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutAdmin();
  };
  
  render() {
    const { users, auth: { admin } } = this.props;
    const { addNewUser, updateUser, deleteUser, onLogoutClick } = this;

    if (this.props.loading) return <LoadingDashboard />

    return (
      <div style={{ width: "100vw" }} className="container valign-wrapper">
        <div className="row">
          <div style={{ maxWidth: "100vw" }} className="col s12 center-align">
            <h4>
              <b>Hey there,</b> {admin.name.split(" ")[0]}
            </h4>
            <br />
            <MaterialTable
              title="USERS"
              columns={COLUMNS}
              data={users}
              editable={{
                onRowAdd: addNewUser,
                onRowUpdate: updateUser,
                onRowDelete: deleteUser
              }}
              options={{
                pageSizeOptions: [5],
                showFirstLastPageButtons: false,
                emptyRowsWhenPaging: false,
                // isLoading: true
              }}
            />
            <button
              style={{
                width: "150px",
                borderRadius: "3px",
                letterSpacing: "1.5px",
                marginTop: "1rem"
              }}
              onClick={onLogoutClick}
              className="btn btn-large waves-effect waves-light hoverable blue accent-3"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }
}

AdminDashboard.propTypes = {
  loadUserData: PropTypes.func.isRequired,
  logoutAdmin: PropTypes.func.isRequired,
  users: PropTypes.array.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = ({ users: userStore, auth }) => {
  if (!userStore.users.length) {
    return {
      loading: true,
      auth: {},
      users: [],
    }
  }

  const normalizedUsers = userStore.users.map(user => ({
    id: user._id,
    name: user.name,
    email: user.email,
    reviewCount: user.reviewsCount,
  }));

  return {
    loading: false,
    auth,
    users: normalizedUsers,
  }
};

const mapDispatchToProps = dispatch => ({
  loadUserData: () => dispatch(userData()),
  logoutAdmin: () => dispatch(logoutAdmin()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminDashboard);