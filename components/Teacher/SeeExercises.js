import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";

import Tooltip from "@material-ui/core/Tooltip";

import Dialog from "@material-ui/core/Dialog";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

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

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class SeeExercises extends React.Component {
  state = {
    exercises: [],
    open: false,
    openNewExerciseModal: false,
    openEditExerciseModal: false
  };

  modifyExamHandler = () => {
    if (window.confirm("Are you sure you want to modify this exam?")) {
      console.log("thisprops: ", this.props);

      Router.push({
        pathname: `/modify_exam`,
        query: {
          examID: `${this.props.id}`,
          examDescription: `${this.props.description}`,
          examStartingAt: `${this.props.startingAt}`
        }
      });
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Tooltip title="Edit exam">
          <IconButton
            className={classes.button}
            // className={classes.margin}
            aria-label="Edit"
            size="small"
            onClick={this.modifyExamHandler}
            color="primary"
          >
            <EditIcon />
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
