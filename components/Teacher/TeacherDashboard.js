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

import ExamRow from "./ExamRow.js";

const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto"
  }
});

class TeacherDashboard extends React.Component {
  state = {
    items: [],
    isLoaded: false
  };

  componentDidMount = () => {
    const url =
      "http://localhost:8010/exams?size=10&page=0&sort=description,asc";

    fetch(url)
      .then(async res => {
        const outputJSONResponse = await res.json();
        console.log("The JSON with all the exams is: ", outputJSONResponse);

        this.setState({
          isLoaded: true,
          items: outputJSONResponse
        });
      })
      .catch(err => console.log(err));
  };

  deleteExam = (index, event) => {
    // const items = Object.assign([], this.state.items);
    console.log("Deleting exam with ID: ", items[index].id);

    const url = "http://localhost:8010/exams/" + items[index].id.toString();

    items.splice(index, 1);
    this.setState({ items: items });

    // then hit the API
    fetch(url, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    })
      .then(res => res.text()) // OR res.json()
      .then(res => console.log(res));
  };

  handleDescriptionChange = (exam, event) => {
    const items = Object.assign([], this.state.items);
    console.log("event is: ", event);
    console.log("exam is: ", exam);

    this.setState(state => {
      const items = state.items.map(exam_item => {
        if (exam_item.id === exam.id) {
          console.log("changing the description of...: ", exam_item.id);
          // hit API endpoint here

          let url = "http://localhost:8010/exams/" + exam_item.id.toString();

          fetch(url, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              description: "HOLAA",
              startingAt: exam.startingAt,
              duration: exam.duration
            })
          })
            .then(res => res.text()) // OR res.json()
            .then(res => console.log(res));

          return exam_item;
        } else {
          return exam_item;
        }
      });

      // CHANGE THE STATE
      console.log(items);

      return {
        items
      };
    });
  };

  startExam = examId => {
    const items = Object.assign([], this.state.items);
    console.log(items);

    this.setState(state => {
      const items = state.items.map(exam => {
        if (exam.id === examId) {
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
      console.log(items);
      // CHANGE THE STATE
      return {
        items
      };
    });
  };

  stopExam = examId => {
    const items = Object.assign([], this.state.items);
    console.log(items);

    this.setState(state => {
      const items = state.items.map(exam => {
        if (exam.id === examId) {
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
      console.log(items);
      // CHANGE THE STATE
      return {
        items
      };
    });
  };

  render() {
    const { classes } = this.props;
    if (!this.state.isLoaded) {
      return <div>Loading...</div>;
    } else if (this.state.items < 1) {
      return (
        <Typography variant="h6" gutterBottom>
          You have no exams created yet 🤷‍♂️
        </Typography>
      );
    } else {
      return (
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell align="center" style={{ maxWidth: "2px" }}>
                  Exam ID
                </TableCell>
                <TableCell align="center">Title</TableCell>
                <TableCell align="center">Starting Date & Time</TableCell>
                <TableCell align="center">Expected Duration</TableCell>
                <TableCell align="center">State</TableCell>
                <TableCell align="center">Actual Starting Moment</TableCell>
                <TableCell align="center">Actual Duration</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.items.map((item, index) => (
                <ExamRow
                  key={index}
                  id={item.id}
                  description={item.description}
                  startingAt={item.startingAt}
                  duration={item.duration}
                  state={item.state}
                  actualStartingMoment={item.actualStartingMoment}
                  actualDuration={item.actualDuration}
                  deleteEvent={this.deleteExam.bind(this, index)}
                  startExam={this.startExam.bind(this, item.id)}
                  stopExam={this.stopExam.bind(this, item.id)}
                  onDescriptionChange={this.handleDescriptionChange.bind(
                    this,
                    item
                  )}
                  // changeEvent={this.changeUserName.bind(this, user.description)}
                  // key={user.id }
                />
              ))}
            </TableBody>
          </Table>
        </Paper>
      );
    }
  }
}

TeacherDashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(TeacherDashboard);
