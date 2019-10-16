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
    margin: theme.spacing.unit
  },
  extendedIcon: {
    marginRight: theme.spacing.unit
  }
})

function SubmissionExerciseRow(props) {
  return (
    <TableRow key={props.solutionID}>
      <TableCell align="center">{props.solutionID}</TableCell>
      <TableCell align="center">{props.exerciseID.toString()}</TableCell>
      <TableCell align="center">{props.compilerFlags}</TableCell>
      <TableCell align="center">PONER UN BUTTON ACA</TableCell>
      <TableCell align="center" style={{ maxWidth: '25px' }}>
        <Grid container spacing={24}>
          {/* <Grid item xs={4}>
            <EditUserInRow username={props.username} active={props.active} />
          </Grid> */}
          <Grid item xs={4}>
            <Tooltip title="Ver este ejercicio en detalle">
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
