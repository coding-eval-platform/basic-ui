import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';


import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

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
      <TableCell component="th" scope="item">{props.id}</TableCell>
      <TableCell align="center">{props.description}</TableCell>
      <TableCell align="center">{props.startingAt}</TableCell>
      <TableCell align="center">{props.duration}</TableCell>
      <TableCell align="center">{props.state}</TableCell>
      <TableCell align="center">{props.actualStartingMoment}</TableCell>
      <TableCell align="center">{props.actualDuration}</TableCell>
      <IconButton aria-label="Delete" className={classes.margin} align="center">
          <DeleteIcon fontSize="small" />
        </IconButton>
    </TableRow>
  )
}

ExamRow.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ExamRow);
