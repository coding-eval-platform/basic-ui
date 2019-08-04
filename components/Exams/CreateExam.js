import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";  
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

import Typography from "@material-ui/core/Typography";

const styles = theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  }
});

class CreateExam extends Component {
  state = {
    description: "",
    startingAt: "",
    duration: ""
  };

  onDescriptionChange = description => {
    this.setState({ description: description.target.value });
  };

  onDurationnChange = duration => {
    this.setState({ duration: duration.target.value });
  };

  render() {
    return (
      <div>
        <Typography style={{ margin: 20 }} variant="h5" gutterBottom>
          Create an exam
        </Typography>
        <Grid container spacing={24} alignItems="center">
          <Grid item xs={6}>
            <TextField
              id="outlined-name"
              label="Exam title"
              placeholder="Example: POO first exam"
              style={{ margin: 20 }}
              onChange={this.onDescriptionChange}
              value={this.state.description}
              fullWidth
              margin="normal"
              variant="outlined"
            />
          </Grid>
        </Grid>
        <Grid container spacing={24} alignItems="center">
          <Grid item xs={3}>
            <TextField
              id="datetime-local"
              label="Insert date and time"
              type="datetime-local"
              style={{ margin: 20 }}
              defaultValue="2017-05-24T10:30"
              // value={props.data.startingAt}
              // InputLabelProps={{
              //   shrink: true
              // }}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              id="outlined-name"
              label="Exam duration (mins)"
              placeholder="Example: 120"
              style={{ margin: 20 }}
              onChange={this.onDurationChange}
              value={this.state.duration}
              fullWidth
              margin="normal"
              variant="outlined"
            />
          </Grid>
        </Grid>
        <Grid container spacing={24} alignItems="center">
          <Grid item xs={6}>
            <Button
              style={{ margin: 20 }}
              variant="contained"
              color="primary"
              // onClick={props.createExamHandler}
            >
              Create exam
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}

CreateExam.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CreateExam);
