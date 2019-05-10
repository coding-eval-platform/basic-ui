import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';


import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import Moment from 'react-moment';



import SeeExercises from './SeeExercises';

const styles = theme => ({
  margin: {
    margin: theme.spacing.unit,
  },
  extendedIcon: {
    marginRight: theme.spacing.unit,
  },
});


function ExamRow(props) {

  const { classes } = props;


  return (
    <TableRow key={props.id}>
      <TableCell align="center" component="th" scope="item">{props.id}</TableCell>
      <TableCell align="center">{props.description}</TableCell>
      <TableCell align="center">
        <Moment format="LLL">
          {props.startingAt}
        </Moment>
      </TableCell>
      <TableCell align="center">{props.duration}</TableCell>
      <TableCell align="center">{props.state}</TableCell>
      <TableCell align="center">{props.actualStartingMoment}</TableCell>
      <TableCell align="center">{props.actualDuration}</TableCell>
      <TableCell align="center">
        <Grid container spacing={24}>
          <Grid item xs={3}>
            <SeeExercises id={props.id} description={props.description} />
          </Grid>
          <Grid item xs={3}>
            <Tooltip title="Start this exam">
              <Button
                size="small"
                className={classes.margin}
                variant="outlined"
                onClick={props.startExam}
                color="primary">
                Play
            </Button>
            </Tooltip>
          </Grid>
          <Grid item xs={3}>
            <Tooltip title="Stop this exam">
              <Button
                size="small"
                className={classes.margin}
                variant="outlined"
                onClick={props.stopExam}
                color="primary">
                Stop
            </Button>
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
  )
}

ExamRow.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ExamRow);
