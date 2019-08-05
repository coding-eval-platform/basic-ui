import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";  
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

import Router from 'next/router'
import { MuiPickersUtilsProvider, DateTimePicker } from "material-ui-pickers";
import MomentUtils from "@date-io/moment";
import moment from "moment";

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
    startingAt: "2019-10-06T15:00:00",
    duration: ""
  };

  onDescriptionChange = description => {
    this.setState({ description: description.target.value });
  };

  onDurationChange = duration => {
    this.setState({ duration: duration.target.value });
  };

  onDateTimeChange = startingAt => {
    this.setState({ startingAt: moment(startingAt._d).format('YYYY-MM-DDTHH:mm:ss') });
  };

  createExam = () => {
    console.log('POST sent this: ', JSON.stringify({
      description: this.state.description,
      duration: this.state.duration,
      startingAt: this.state.startingAt
    }));

    fetch('http://localhost:8010/exams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        description: this.state.description,
        duration: this.state.duration,
        startingAt: this.state.startingAt
      })
    })
      .then((res) => {
        // console.log('RESPONSE IS: ', res.headers.get('Location'));
        let exam_id = res.headers.get('Location').split('/');
        exam_id = exam_id[exam_id.length-1];
        console.log('EXAM_ID IS: ', exam_id);
        // this.setState({
        //   exam_id
        // });
        // this.props.history.push(`/create_exercises/${exam_id}/`);  
        Router.push(`/create_exercises?exam_id=${exam_id}`);
      })
      .catch((err) => console.log(err))
  }

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
              placeholder="Example: OOP first exam"
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
          <Grid item xs={3}>
            {/* <TextField
              id="datetime-local"
              label="Insert date and time"
              type="datetime-local"
              style={{ margin: 20 }}
              defaultValue="2017-05-24T10:30"
              // value={props.data.startingAt}
              // InputLabelProps={{
              //   shrink: true
              // }}
            /> */}
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <DateTimePicker
                label="Insert date and time"
                value={this.state.startingAt}
                style={{ margin: 20 }}
                onChange={this.onDateTimeChange}
              />
            </MuiPickersUtilsProvider>
          </Grid>
        </Grid>
        <Grid container spacing={24} alignItems="center">
          <Grid item xs={6}>
            <Button
              style={{ margin: 20 }}
              variant="contained"
              color="primary"
              onClick={this.createExam}
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
