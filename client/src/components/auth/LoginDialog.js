import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { setToggleLogin } from '../../actions/authActions';
import Dialog, { DialogTitle, DialogContent } from '@material/react-dialog';
import List, {
  ListItem,
  ListItemGraphic,
  ListItemText
} from '@material/react-list';
import MaterialIcon from '@material/react-material-icon';

const choices = ['Admin', 'User', 'Register'];

class LoginDialog extends Component {
  onDialogClose = action => {
    switch (action) {
      case 'Admin':
        this.props.setToggleLogin(false);
        return this.props.history.push('/login_admin');
      case 'User':
        this.props.setToggleLogin(false);
        return this.props.history.push('/login_user');
      case 'Register':
        this.props.setToggleLogin(false);
        return this.props.history.push('/add_user');
      default:
        this.props.setToggleLogin(false);
    }
  };

  handleIcon = choice => {
    if (choice === 'Admin') return 'supervisor_account';
    if (choice === 'User') return 'person';
    return 'add';
  };

  render() {
    const { isOpen } = this.props;
    const { onDialogClose, handleIcon } = this;

    return (
      <Dialog open={isOpen} onClose={action => onDialogClose(action)}>
        <DialogTitle>Login</DialogTitle>
        <DialogContent>
          <List avatarList>
            {choices.map((choice, i) => (
              <ListItem key={i} data-mdc-dialog-action={choice}>
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

const mapStateToProps = state => ({
  isOpen: state.auth.isOpen
});

const mapDispatchToProps = {
  setToggleLogin
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(LoginDialog)
);
