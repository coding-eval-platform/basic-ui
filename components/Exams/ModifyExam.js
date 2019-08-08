import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

import Router from "next/router";
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

class ModifyExam extends Component {
  state = {
    examID: "",
    description: "",
    startingAt: "",
    duration: ""
  };

  componentDidMount = () => {
    const examID = new URL(window.location.href).searchParams.get("examID");
    // console.log('The examid is: ', examID);

    this.setState({
      examID: examID
    });

    const url = "http://localhost:8010/exams/" + `${examID}`;

    fetch(url)
      .then(async res => {
        const examJSONResponse = await res.json();
        console.log("The exam to be updated is: ", examJSONResponse);

        this.setState({
          examID: examJSONResponse.id,
          description: examJSONResponse.description,
          startingAt: examJSONResponse.startingAt,
          duration: examJSONResponse.duration
        });
      })
      .catch(err => console.log(err));
  };

  onDescriptionChange = description => {
    this.setState({ description: description.target.value });
  };

  onDurationChange = duration => {
    this.setState({ duration: duration.target.value });
  };

  onDateTimeChange = startingAt => {
    this.setState({
      startingAt: moment(startingAt._d).format("YYYY-MM-DDTHH:mm:ss")
    });
  };

  updateExam = () => {
    console.log(
      "PUT sent this: ",
      JSON.stringify({
        description: this.state.description,
        duration: this.state.duration,
        startingAt: this.state.startingAt
      })
    );

    const url = "http://localhost:8010/exams/" + `${this.state.examID}`;

    fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        description: this.state.description,
        duration: this.state.duration,
        startingAt: this.state.startingAt
      })
    })
      .then(res => {
        Router.push(`/teacher_dashboard`);
      })
      .catch(err => console.log(err));
  };

  addExercise = () => {
    Router.push({
      pathname: `/create_exercises`,
      query: {
        examID: `${this.state.examID}`,
        examDescription: `${this.state.description}`
      }
    });
  };

  seeExercises = () => {
    Router.push({
      pathname: `/exam_dashboard`,
      query: {
        examID: `${this.state.examID}`,
        examDescription: `${this.state.description}`
      }
    });
  };

  render() {
    const examDescription = new URL(window.location.href).searchParams.get(
      "examDescription"
    );

    return (
      <div>
        <Typography style={{ margin: 20 }} variant="h5" gutterBottom>
          Update the exam: {examDescription}
        </Typography>
        <Grid container spacing={24} alignItems="center">
          <Grid item xs={6}>
            <TextField
              id="outlined-name"
              label="Exam title"
              // placeholder="Example: OOP first exam"
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
              // placeholder="Example: 120"
              style={{ margin: 20 }}
              onChange={this.onDurationChange}
              value={this.state.duration}
              fullWidth
              margin="normal"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={3}>
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
              variant="outlined"
              color="primary"
              onClick={this.addExercise}
            >
              Add an exercise to the exam
            </Button>
          </Grid>
        </Grid>
        <Grid container spacing={24} alignItems="center">
          <Grid item xs={6}>
            <Button
              style={{ margin: 20 }}
              variant="outlined"
              color="primary"
              onClick={this.seeExercises}
            >
              View and edit exercises
            </Button>
          </Grid>
        </Grid>
        <Grid container spacing={24} alignItems="center">
          <Grid item xs={6}>
            <Button
              style={{ margin: 20 }}
              variant="contained"
              color="primary"
              onClick={this.updateExam}
            >
              Modify exam
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}

ModifyExam.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ModifyExam);
