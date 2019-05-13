import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

const styles = theme => ({
  root: {
    display: 'flex',
  },
  formControl: {
    margin: theme.spacing.unit * 3,
  },
  group: {
    margin: `${theme.spacing.unit}px 0`,
  },
});


class TestCaseDialog extends React.Component {
  state = {
    open: false,
    visibility: ""
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleChange = event => {
    this.setState({ visibility: event.target.value });
  };

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
          Add Test Case
        </Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Create a new test case</DialogTitle>

          <DialogContent>

            <DialogContentText>
              Please insert all the details about the test case for this exercise.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Email Address"
              type="email"
              fullWidth
            />

            <FormControl component="fieldset" className={classes.formControl}>
              <FormLabel component="legend">Visibility of this test case</FormLabel>
              <RadioGroup
                aria-label="visibility"
                name="visibility"
                className={classes.group}
                value={this.state.value}
                onChange={this.handleChange}
              >
                <FormControlLabel value="public" control={<Radio />} label="Public visibility" />
                <FormControlLabel value="private" control={<Radio />} label="Private visibility" />
              </RadioGroup>
            </FormControl>
            
          </DialogContent>


          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleClose} color="primary">
              Create test case
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

TestCaseDialog.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TestCaseDialog);