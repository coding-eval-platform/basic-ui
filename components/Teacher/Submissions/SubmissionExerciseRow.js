import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered'
import Tooltip from '@material-ui/core/Tooltip'

const styles = theme => ({
  margin: {
    margin: theme.spacing(1)
  },
  extendedIcon: {
    marginRight: theme.spacing(1)
  }
})

function SubmissionExerciseRow(props) {
  return (
    <TableRow key={props.solutionID}>
      <TableCell align="center">{props.solutionID}</TableCell>
      <TableCell align="center">{props.exerciseID.toString()}</TableCell>
      <TableCell align="center">{props.compilerFlags}</TableCell>
      <TableCell align="center" style={{ maxWidth: '25px' }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Tooltip title="Ver esta solución en detalle">
              <IconButton aria-label="See" onClick={props.viewSolutionDetail}>
                <FormatListNumberedIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </TableCell>
    </TableRow>
  )
}

SubmissionExerciseRow.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(SubmissionExerciseRow)
