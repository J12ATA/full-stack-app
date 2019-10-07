import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MaterialTable from 'material-table';
import { userData } from '../../actions/userActions';
import { createNewUser, deleteUser, updateUser } from '../../utils/api';
import setActiveNav from '../../actions/navActions';
import setNavTitle from '../../actions/titleActions';

class AdminDashboard extends Component {
  state = {
    columns: [
      { title: 'Name', field: 'name' },
      { title: 'Email', field: 'email' },
      {
        title: 'Reviews',
        field: 'reviewCount',
        editable: 'never',
        hidden: false,
      },
      {
        title: 'Password',
        field: 'password',
        hidden: true,
      },
      {
        title: 'Confirm Password',
        field: 'password2',
        hidden: true,
      },
    ],
  };

  componentDidMount() {
    const { loadUserData, activeNav, navTitle } = this.props;

    activeNav('Dashboard');
    navTitle('Dashboard');
    loadUserData();
  }

  columnsHidden = () => {
    const { columns } = this.state;
    const newColumns = [...columns];
    newColumns[2].hidden = true;
    newColumns[3].hidden = false;
    newColumns[4].hidden = false;
    this.setState(() => ({ columns: newColumns }));
  };

  columnsReset = () => {
    const { columns } = this.state;
    const newColumns = [...columns];
    newColumns[2].hidden = false;
    newColumns[3].hidden = true;
    newColumns[4].hidden = true;
    this.setState(() => ({ columns: newColumns }));
  };

  addNewUser = async (user) => {
    const { loadUserData } = this.props;
    const { columnsHidden, columnsReset } = this;

    columnsHidden();
    await createNewUser({ ...user });
    columnsReset();
    loadUserData();
    Promise.resolve();
  };

  updateUserData = async (user) => {
    const { loadUserData } = this.props;
    const { columnsHidden, columnsReset } = this;

    columnsHidden();
    await updateUser(user);
    columnsReset();
    loadUserData();
    Promise.resolve();
  };

  removeUser = async (user) => {
    const { loadUserData } = this.props;

    await deleteUser(user.id);
    loadUserData();
    Promise.resolve();
  };

  render() {
    const { users } = this.props;
    const { columns } = this.state;
    const { columnsReset } = this;
    const { addNewUser, updateUserData, removeUser } = this;

    return (
      <div className="admin-table">
        <MaterialTable
          title="USERS"
          columns={columns}
          data={users}
          editable={{
            onRowAdd: addNewUser,
            onRowUpdate: updateUserData,
            onRowDelete: removeUser,
          }}
          options={{
            pageSizeOptions: [5],
            showFirstLastPageButtons: false,
            emptyRowsWhenPaging: false,
          }}
          localization={{
            body: { editRow: { deleteText: 'Delete this user?' } },
          }}
          tableRef={(props) => {
            const { modifiedHook } = this.state;

            if (props && modifiedHook !== true) {
              const cancel = props.onEditingCanceled;
              // eslint-disable-next-line no-param-reassign
              props.onEditingCanceled = (mode, editProps) => {
                columnsReset();
                this.setState({ modifiedHook: true });
                cancel(mode, editProps);
              };
            }
          }}
        />
      </div>
    );
  }
}

AdminDashboard.propTypes = {
  loadUserData: PropTypes.func.isRequired,
  activeNav: PropTypes.func.isRequired,
  navTitle: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  users: PropTypes.array.isRequired,
  auth: PropTypes.shape({
    isAuthenticated: PropTypes.bool,
    isOpen: PropTypes.bool,
    admin: PropTypes.object,
    user: PropTypes.object,
  }).isRequired,
};

const mapStateToProps = ({ users: userStore, auth }) => {
  if (!userStore.users.length) {
    return {
      auth: {},
      users: [],
    };
  }

  const normalizedUsers = userStore.users.map((user) => ({
    // eslint-disable-next-line no-underscore-dangle
    id: user._id,
    name: user.name,
    email: user.email,
    reviewCount: user.reviewsCount,
  }));

  return { auth, users: normalizedUsers };
};

const mapDispatchToProps = {
  loadUserData: userData,
  activeNav: setActiveNav,
  navTitle: setNavTitle,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AdminDashboard);
