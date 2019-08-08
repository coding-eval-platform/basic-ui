import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";

import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Router from "next/router";

import ExerciseRow from "./ExerciseRow.js";

const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto"
  }
});

class ExerciseDashboard extends React.Component {
  state = {
    exerciseID: "",
    exerciseQuestion: "",
    testCases: [],
    isLoaded: false
  };

  componentDidMount = () => {
    const exerciseID = new URL(window.location.href).searchParams.get(
      "exerciseID"
    );
    const exerciseQuestion = new URL(window.location.href).searchParams.get(
      "exerciseQuestion"
    );
    const url =
      "http://localhost:8010/exercises/" + `${exerciseID}` + "/test-cases/public";

    this.setState({
      exerciseID: exerciseID,
      exerciseQuestion: exerciseQuestion
    });

    fetch(url)
      .then(async res => {
        const outputJSONResponse = await res.json();
        console.log("The JSON with all the testCases is: ", outputJSONResponse);

        this.setState({
          isLoaded: true,
          testCases: outputJSONResponse
        });
      })
      .catch(err => console.log(err));
  };

  createTestCase = () => {
    Router.push({
      pathname: `/create_testcase`,
      query: {
        exerciseID: `${this.state.exerciseID}`,
        exerciseQuestion: `${this.state.exerciseQuestion}`
      }
    });
  };

  deleteTestCase = (index, event) => {
    if (window.confirm("Are you sure you want to delete this test case?")) {
      console.log(
        "Deleting test case with ID: ",
        this.state.testCases[index].id
      );

      const url =
        "http://localhost:8010/test-cases/" +
        this.state.testCases[index].id.toString();

      // Removes the desired item.
      this.state.testCases.splice(index, 1);
      // console.log("LOS testCases DE AHORA SON: ", this.state.testCases);
      this.setState({ testCases: this.state.testCases });

      // then hit the API
      fetch(url, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
      })
        .then(res => res.text()) // OR res.json()
        .then(res => console.log(res));
    }
  };

  editTestCase = exerciseID => {
    if (window.confirm("Are you sure you want to start this exam?")) {
      const testCases = Object.assign([], this.state.testCases);
      console.log(testCases);

      this.setState(state => {
        const testCases = state.testCases.map(exam => {
          if (exam.id === exerciseID) {
            console.log("el exam es: ", exam);
            // hit API endpoint here

            let url =
              "http://localhost:8010/exams/" + exam.id.toString() + "/start";

            // Change the exam here
            exam.state = "IN_PROGRESS";

            fetch(url, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                description: "STARTED",
                startingAt: "2019-10-06T15:00:00",
                duration: "PT150M"
              })
            })
              .then(res => res.text()) // OR res.json()
              .then(res => console.log(res));
            return exam;
          } else {
            return exam;
          }
        });

        // SEE NEW STATE
        console.log(testCases);
        // CHANGE THE STATE
        return {
          testCases
        };
      });
    }
  };

  createTestCaseforExercise = exerciseID => {
    if (window.confirm("Are you sure you want to finish this exam?")) {
      const testCases = Object.assign([], this.state.testCases);
      console.log(testCases);

      this.setState(state => {
        const testCases = state.testCases.map(exam => {
          if (exam.id === exerciseID) {
            console.log("el exam es: ", exam);
            // hit API endpoint here

            let url =
              "http://localhost:8010/exams/" + exam.id.toString() + "/finish";

            // Change the exam here
            exam.state = "FINISHED";

            fetch(url, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                description: "FINISHED",
                startingAt: "2019-10-06T15:00:00",
                duration: "PT150M"
              })
            })
              .then(res => res.text()) // OR res.json()
              .then(res => console.log(res));

            return exam;
          } else {
            return exam;
          }
        });

        // SEE NEW STATE
        console.log(testCases);
        // CHANGE THE STATE
        return {
          testCases
        };
      });
    }
  };

  render() {
    const { classes } = this.props;
    if (!this.state.isLoaded) {
      return <div>Loading...</div>;
    } else if (this.state.testCases < 1) {
      return (
        <div>
          <Typography variant="h6" style={{ margin: 20 }} gutterBottom>
            You have no test cases created in this exercise yet 🤷‍♂️
          </Typography>
          <Grid container spacing={24} alignItems="center">
            <Grid item xs={6}>
              <Button
                style={{ margin: 20 }}
                variant="contained"
                color="primary"
                onClick={this.createTestCase}
              >
                Create one!
              </Button>
            </Grid>
          </Grid>
        </div>
      );
    } else {
      return (
        <div>
          <Typography variant="h6" style={{ margin: 20 }} gutterBottom>
            Test cases of the exercise: {this.state.exerciseQuestion}
          </Typography>
          <Paper className={classes.root}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell align="center" style={{ maxWidth: "2px" }}>
                    Test Case ID
                  </TableCell>
                  <TableCell align="center">Visibility</TableCell>
                  <TableCell align="center">Timeout (ms)</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.testCases.map((testCase, index) => (
                  <ExerciseRow
                    key={index}
                    id={testCase.id}
                    visibility={testCase.visibility}
                    timeout={testCase.timeout}
                    inputs={testCase.inputs}
                    expectedOutputs={testCase.expectedOutputs}
                    deleteEvent={this.deleteTestCase.bind(this, index)}
                    editTestCase={this.editTestCase.bind(this, testCase.id)}
                    createTestCaseforExercise={this.createTestCaseforExercise.bind(
                      this,
                      testCase.id
                    )}
                    // changeEvent={this.changeUserName.bind(this, user.description)}
                    // key={user.id }
                  />
                ))}
              </TableBody>
            </Table>
          </Paper>
        </div>
      );
    }
  }
}

ExerciseDashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ExerciseDashboard);
