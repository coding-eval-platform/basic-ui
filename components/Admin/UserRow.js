import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import Grid from '@material-ui/core/Grid'

import EditUserInRow from './EditUserInRow'

const styles = theme => ({
  margin: {
    margin: theme.spacing.unit
  },
  extendedIcon: {
    marginRight: theme.spacing.unit
  }
})

function UserRow(props) {
  return (
    <TableRow key={props.username}>
      <TableCell align="center">{props.username}</TableCell>
      <TableCell align="center">{props.active}</TableCell>
      <TableCell align="center">
        <Grid container spacing={24}>
          <Grid item xs={2}>
            <EditUserInRow username={props.username} active={props.active} />
          </Grid>
        </Grid>
      </TableCell>
    </TableRow>
  )
}

UserRow.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(UserRow)
