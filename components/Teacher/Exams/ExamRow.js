import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import Tooltip from "@material-ui/core/Tooltip";
import Grid from "@material-ui/core/Grid";

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

const convertHMS = value => {
  const sec = parseInt(value, 10); // convert value to number if it's string
  let hours = Math.floor(sec / 3600); // get hours
  let minutes = Math.floor((sec - hours * 3600) / 60); // get minutes
  let seconds = sec - hours * 3600 - minutes * 60; //  get seconds
  // add 0 if value < 10
  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  // return hours+':'+minutes+':'+seconds; // Return is HH : MM : SS
  // return hours+'days '+minutes+'hs '+seconds + 'mins';
  return minutes + "hs " + seconds + "mins";
};

function ExamRow(props) {
  const { classes } = props;

  return (
    <TableRow key={props.id}>
      <TableCell align="center" component="th" scope="item">
        {props.id}
      </TableCell>
      <TableCell align="center">{props.description}</TableCell>
      <TableCell align="center">
        <Moment format="LLL">{props.startingAt}</Moment>
      </TableCell>
      <TableCell align="center">{convertHMS(props.duration)}</TableCell>
      <TableCell align="center">{props.state}</TableCell>
      <TableCell align="center">{props.actualStartingMoment}</TableCell>
      <TableCell align="center">{props.actualDuration}</TableCell>
      <TableCell align="center">
        <Grid container spacing={24}>
          <Grid item xs={2}>
            <SeeExercises
              id={props.id}
              description={props.description}
              startingAt={props.startingAt}
            />
          </Grid>
          <Grid item xs={2}>
            <EditExamInRow
              id={props.id}
              description={props.description}
              startingAt={props.startingAt}
            />
          </Grid>
          <Grid item xs={2}>
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
          <Grid item xs={2}>
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
          <Grid item xs={2}>
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

ExamRow.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ExamRow);
