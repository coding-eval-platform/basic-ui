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


class EditExerciseInRow extends React.Component {
  state = {
    exercises: [],
    open: false,
    openNewExerciseModal: false,
    openEditExerciseModal: false
  };

  modifyExerciseHandler = () => {
    if (window.confirm("Are you sure you want to modify this exercise?")) {
      console.log("thisprops: ", this.props);

      Router.push({
        pathname: `/modify_exercise`,
        query: {
          exerciseID: `${this.props.id}`,
          exerciseQuestion: `${this.props.description}`,
          exerciseLanguage: `${this.props.startingAt}`,
          exerciseAwardedScore: `${this.props.startingAt}`,
          exerciseSolutionTemplate: `${this.props.startingAt}`
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
            onClick={this.modifyExerciseHandler}
            color="primary"
          >
            <EditIcon/>
          </IconButton>
        </Tooltip>
      </div>
    );
  }
}

EditExerciseInRow.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(EditExerciseInRow);
