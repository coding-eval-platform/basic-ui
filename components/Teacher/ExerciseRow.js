import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import Tooltip from "@material-ui/core/Tooltip";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

import Moment from "react-moment";

import PlayIcon from "@material-ui/icons/PlayArrow";
import StopIcon from "@material-ui/icons/Stop";

import EditExamInRow from "./EditExamInRow";
import SeeExercises from "./SeeExercises";

const styles = theme => ({
  margin: {
    margin: theme.spacing.unit
  },
  extendedIcon: {
    marginRight: theme.spacing.unit
  }
});

function ExerciseRow(props) {
  const { classes } = props;
  console.log('PROPS ARE: ', props);
  

  return (
    <TableRow key={props.id}>
      <TableCell align="center" component="th" scope="item">
        {props.id}
      </TableCell>
      <TableCell align="center">{props.question}</TableCell>
      <TableCell align="center">{props.language}</TableCell>
      <TableCell align="center">{props.awardedScore}</TableCell>
      <TableCell align="center">
        <Grid container spacing={24}>
          <Grid item xs={3}>
            <SeeExercises
              id={props.id}
              description={props.description}
              startingAt={props.startingAt}
            />
          </Grid>
          <Grid item xs={3}>
            <EditExamInRow
              id={props.id}
              description={props.description}
              startingAt={props.startingAt}
            />
          </Grid>
          <Grid item xs={3}>
            <Tooltip title="Start this exam">
              <IconButton
                className={classes.button}
                // className={classes.margin}
                aria-label="Play"
                size="small"
                onClick={props.startExam}
                color="primary"
              >
                <PlayIcon />
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid item xs={3}>
            <Tooltip title="Finish this exam">
              <IconButton
                className={classes.button}
                // className={classes.margin}
                aria-label="Finish"
                size="small"
                onClick={props.finishExam}
                color="primary"
              >
                <StopIcon />
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid item xs={3}>
            <Tooltip title="Delete this exam">
              <IconButton aria-label="Delete" onClick={props.deleteEvent}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </TableCell>
    </TableRow>
  );
}

ExerciseRow.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ExerciseRow);
