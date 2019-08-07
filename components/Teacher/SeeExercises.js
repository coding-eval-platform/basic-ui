import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import FormatListNumberedIcon from "@material-ui/icons/FormatListNumbered";
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

class SeeExercises extends React.Component {
  state = {
    exercises: [],
    open: false,
    openNewExerciseModal: false,
    openEditExerciseModal: false
  };

  seeExercisesHandler = () => {
    console.log("thisprops: ", this.props);

    Router.push({
      pathname: `/modify_exam`,
      query: {
        examID: `${this.props.id}`,
        examDescription: `${this.props.description}`,
        examStartingAt: `${this.props.startingAt}`
      }
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Tooltip title="See exercises">
          <IconButton
            className={classes.button}
            // className={classes.margin}
            aria-label="SeeExercises"
            size="small"
            onClick={this.seeExercisesHandler}
            color="primary"
          >
            <FormatListNumberedIcon />
          </IconButton>
        </Tooltip>
      </div>
    );
  }
}

SeeExercises.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SeeExercises);
