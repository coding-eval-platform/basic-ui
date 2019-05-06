import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';


import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';
import TextField from '@material-ui/core/TextField';

import EditExam from './EditExam';

const styles = theme => ({
  margin: {
    margin: theme.spacing.unit,
  },
  extendedIcon: {
    marginRight: theme.spacing.unit,
  },
});


function ExamRow(props) {

  return (
    <TableRow key={props.id}>
      <TableCell component="th" scope="item">{props.id}</TableCell>
      <TableCell align="center">
        <TextField
          fullWidth
          id="standard-name"
          value={props.description}
          onChange={props.onDescriptionChange}   // it gets handler function from prop too!
          margin="normal"
        />
        
      </TableCell>
      <TableCell align="center">{props.startingAt}</TableCell>
      <TableCell align="center">{props.duration}</TableCell>
      <TableCell align="center">{props.state}</TableCell>
      <TableCell align="center">{props.actualStartingMoment}</TableCell>
      <TableCell align="center">{props.actualDuration}</TableCell>
      <TableCell align="center">
        <EditExam />
        <Tooltip title="Delete this exam">
          <IconButton aria-label="Delete" onClick={props.deleteEvent}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  )
}

ExamRow.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ExamRow);
