import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import Dialog, { DialogTitle, DialogContent } from '@material/react-dialog';
import List, {
  ListItem,
  ListItemGraphic,
  ListItemText,
} from '@material/react-list';
import MaterialIcon from '@material/react-material-icon';
import { setToggleLogin } from '../../actions/authActions';

const choices = ['Admin', 'User', 'Register'];

class LoginDialog extends Component {
  onDialogClose = (action) => {
    const { isLogin, history } = this.props;
    switch (action) {
      case 'Admin':
        isLogin(false);
        return history.push('/login_admin');
      case 'User':
        isLogin(false);
        return history.push('/login_user');
      case 'Register':
        isLogin(false);
        return history.push('/add_user');
      default:
        return isLogin(false);
    }
  };

  handleIcon = (choice) => {
    if (choice === 'Admin') return 'supervisor_account';
    if (choice === 'User') return 'person';
    return 'add';
  };

  render() {
    const { isOpen } = this.props;
    const { onDialogClose, handleIcon } = this;

    return (
      <Dialog open={isOpen} onClose={(action) => onDialogClose(action)}>
        <DialogTitle>Login</DialogTitle>
        <DialogContent>
          <List avatarList>
            {choices.map((choice) => (
              <ListItem key={choice} data-mdc-dialog-action={choice}>
                <ListItemGraphic
                  graphic={<MaterialIcon icon={handleIcon(choice)} />}
                />
                <ListItemText primaryText={choice} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    );
  }
}

LoginDialog.propTypes = {
  isLogin: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
};

const mapStateToProps = ({ auth }) => ({ isOpen: auth.isOpen });

const mapDispatchToProps = {
  isLogin: setToggleLogin,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(LoginDialog),
);
