import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import EditIcon from "@material-ui/icons/Edit";
import Router from "next/router";

const styles = theme => ({
  margin: {
    margin: theme.spacing.unit
  },
  appBar: {
    position: "relative"
  },
  flex: {
    flex: 1
  }
});


class EditTestCaseInRow extends React.Component {
  state = {
    exercises: [],
    open: false,
    openNewExerciseModal: false,
    openEditExerciseModal: false
  };

  modifyTestCaseHandler = () => {
    if (window.confirm("Are you sure you want to modify this test case?")) {
      // console.log("thisprops: ", this.props);

      Router.push({
        pathname: `/modify_testcase`,
        query: {
          exerciseID: `${this.props.id}`,
          exerciseQuestion: `${this.props.exerciseQuestion}`,
          exerciseLanguage: `${this.props.exerciseLanguage}`,
          exerciseSolutionTemplate: `${this.props.exerciseSolutionTemplate}`,
          exerciseAwardedScore: `${this.props.exerciseAwardedScore}`
        }
      });
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Tooltip title="Edit this exercise">
          <IconButton
            className={classes.button}
            // className={classes.margin}
            aria-label="Edit"
            size="small"
            onClick={this.modifyTestCaseHandler}
            color="primary"
          >
            <EditIcon/>
          </IconButton>
        </Tooltip>
      </div>
    );
  }
}

EditTestCaseInRow.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(EditTestCaseInRow);
