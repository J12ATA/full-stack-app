import React, { Component } from "react";
import Dialog, { DialogTitle, DialogContent } from "@material/react-dialog";
import List, {
  ListItem,
  ListItemGraphic,
  ListItemText
} from "@material/react-list";
import MaterialIcon from "@material/react-material-icon";

class Landing extends Component {
  state = {
    isOpen: true,
    choices: ["Admin", "User", "Register"],
    action: ""
  };

  onDialogClose = action => {
    this.setState({ action, isOpen: false });
  };

  handleIcon = choice => {
    if (choice === "Admin") return "supervisor_account";
    if (choice === "User") return "person";
    return "add";
  };

  render() {
    const { isOpen, choices } = this.state;
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

export default Landing;
