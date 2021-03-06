import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered'
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline'
import Tooltip from '@material-ui/core/Tooltip'

const styles = theme => ({
  margin: {
    margin: theme.spacing.unit
  },
  extendedIcon: {
    marginRight: theme.spacing.unit
  }
})

function SubmitterRow(props) {
  return (
    <TableRow key={props.submitterID}>
      <TableCell align="center">{props.submitterID}</TableCell>
      <TableCell align="center">{props.submitter.toString()}</TableCell>
      <TableCell align="center">{props.score.toString()}</TableCell>
      <TableCell align="center" style={{ maxWidth: '25px' }}>
        <Grid container spacing={24}>
          {/* <Grid item xs={4}>
            <EditUserInRow username={props.username} active={props.active} />
          </Grid> */}
          <Grid item xs={6}>
            <Tooltip title="Ver los ejercicios de esta entrega">
              <IconButton aria-label="See" onClick={props.viewExercisesEvent}>
                <FormatListNumberedIcon />
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid item xs={6}>
            <Tooltip title="Puntuar el examen">
              <IconButton aria-label="Mark" onClick={props.markExamEvent}>
                <CheckCircleOutlineIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </TableCell>
    </TableRow>
  )
}

SubmitterRow.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(SubmitterRow)
