import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { userData } from '../../actions/userActions';
import { createNewUser, deleteUser, updateUser } from '../../utils/api';
import MaterialTable from 'material-table';
import LoadingDashboard from './loadingDashboard';

class AdminDashboard extends Component {
  state = {
    columns: [
      { title: 'Name', field: 'name' },
      { title: 'Email', field: 'email' },
      {
        title: 'Reviews',
        field: 'reviewCount',
        editable: 'never',
        hidden: false
      },
      { title: 'Password', field: 'password', hidden: true },
      { title: 'Confirm Password', field: 'password2', hidden: true }
    ]
  };

  componentDidMount() {
    this.props.loadUserData();
  }

  columnsHidden = () => {
    const columns = [...this.state.columns];
    columns[2].hidden = true;
    columns[3].hidden = false;
    columns[4].hidden = false;
    this.setState({ columns });
  };

  columnsReset = () => {
    const columns = [...this.state.columns];
    columns[2].hidden = false;
    columns[3].hidden = true;
    columns[4].hidden = true;
    this.setState({ columns });
  };

  addNewUser = async user => {
    this.columnsHidden();
    await createNewUser({ ...user });
    this.columnsReset();
    this.props.loadUserData();
    Promise.resolve();
  };

  updateUser = async user => {
    this.columnsHidden();
    await updateUser(user);
    this.columnsReset();
    this.props.loadUserData();
    Promise.resolve();
  };

  deleteUser = async user => {
    await deleteUser(user.id);
    this.props.loadUserData();
    Promise.resolve();
  };

  render() {
    const { users } = this.props;
    const { columns } = this.state;
    const { addNewUser, updateUser, deleteUser } = this;

    if (this.props.loading) return <LoadingDashboard />;

    return (
      <div className="admin-table">
        <MaterialTable
          title="USERS"
          columns={columns}
          data={users}
          editable={{
            onRowAdd: addNewUser,
            onRowUpdate: updateUser,
            onRowDelete: deleteUser
          }}
          options={{
            pageSizeOptions: [5],
            showFirstLastPageButtons: false,
            emptyRowsWhenPaging: false
          }}
          localization={{
            body: { editRow: { deleteText: 'Delete this user?' } }
          }}
          tableRef={props => {
            if (props && this.state.modifiedHook !== true) {
              let cancel = props.onEditingCanceled;
              props.onEditingCanceled = (mode, props) => {
                this.columnsReset();
                this.setState({ error: {}, modifiedHook: true });
                cancel(mode, props);
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
  users: PropTypes.array.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = ({ users: userStore, auth }) => {
  if (!userStore.users.length) {
    return {
      loading: true,
      auth: {},
      users: []
    };
  }

  const normalizedUsers = userStore.users.map(user => ({
    id: user._id,
    name: user.name,
    email: user.email,
    reviewCount: user.reviewsCount
  }));

  return { loading: false, auth, users: normalizedUsers };
};

const mapDispatchToProps = dispatch => ({
  loadUserData: () => dispatch(userData())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminDashboard);
