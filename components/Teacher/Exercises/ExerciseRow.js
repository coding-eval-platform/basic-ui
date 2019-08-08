import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import Tooltip from "@material-ui/core/Tooltip";
import Grid from "@material-ui/core/Grid";

import EditExerciseInRow from "./EditExerciseInRow";
import SeeTestCases from "./SeeTestCases";

const styles = theme => ({
  margin: {
    margin: theme.spacing.unit
  },
  extendedIcon: {
    marginRight: theme.spacing.unit
  }
});

function ExerciseRow(props) {
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
            <SeeTestCases
              id={props.id}
              description={props.description}
              startingAt={props.startingAt}
            />
          </Grid>
          <Grid item xs={3}>
            <EditExerciseInRow
              id={props.id}
              description={props.description}
              startingAt={props.startingAt}
            />
          </Grid>
          <Grid item xs={3}>
            <Tooltip title="Delete this exercise">
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
