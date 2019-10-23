import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import ReplayIcon from '@material-ui/icons/Replay'
import Tooltip from '@material-ui/core/Tooltip'

const styles = theme => ({
  margin: {
    margin: theme.spacing.unit
  },
  extendedIcon: {
    marginRight: theme.spacing.unit
  }
})

function ResultRow(props) {
  return (
    <TableRow key={props.key}>
      <TableCell align="center">{props.testCaseId}</TableCell>
      <TableCell align="center">{props.result}</TableCell>
      <TableCell align="center" style={{ maxWidth: '25px' }}>
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <Tooltip title="Correr nuevamente el test case">
              <IconButton aria-label="Replay" onClick={props.replayTestCase}>
                <ReplayIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </TableCell>
    </TableRow>
  )
}

ResultRow.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(ResultRow)
