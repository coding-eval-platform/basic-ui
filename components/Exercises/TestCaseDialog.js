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
    userInput: '',
    inputList: [],
    userOutput: '',
    outputList: [],
    visibility: "",
    timeout: 600
  };
  

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleSubmit() {
    const inputsArray = this.state.userInput.split(',');``
    const outputsArray = this.state.userOutput.split(',');

    this.setState({
      inputList: inputsArray,
      outputList: outputsArray,
      open: false
    });
  }

  onChange = e => this.setState({ [e.target.name]: e.target.value })

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

            {/* INPUTS */}
            {/* <DialogContentText>
              Please insert all the details about the test case for this exercise.
            </DialogContentText> */}
            <TextField
              value={this.state.userInput}
              placeholder="Separate inputs with commas"
              onChange={this.onChange}
              autoFocus
              margin="dense"
              id="name"
              label="Insert list of inputs here"
              type="text"
              fullWidth
            />

            {/* VISIBILITY */}
            <FormControl component="fieldset" className={classes.formControl}>
              <FormLabel component="legend">Visibility of this test case</FormLabel>
              <RadioGroup
                aria-label="visibility"
                name="visibility"
                className={classes.group}
                value={this.state.visibility}
                onChange={this.onChange}
              >
                <FormControlLabel value="PUBLIC" control={<Radio />} label="Public test case" />
                <FormControlLabel value="PRIVATE" control={<Radio />} label="Private test case" />
              </RadioGroup>
            </FormControl>

            {/* OUTPUTS */}
            <TextField
              value={this.state.userOutput}
              placeholder="Separate outputs with commas"
              onChange={this.onChange}
              autoFocus
              margin="dense"
              id="name"
              label="Insert list of outputs here"
              type="text"
              fullWidth
            />

          </DialogContent>



          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleSubmit} color="primary">
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