import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import Tooltip from '@material-ui/core/Tooltip'
import Grid from '@material-ui/core/Grid'

import EditTestCaseInRow from './EditTestCaseInRow'
import SeeTestCases from '../Exercises/SeeTestCases'

const styles = theme => ({
  margin: {
    margin: theme.spacing.unit
  },
  extendedIcon: {
    marginRight: theme.spacing.unit
  }
})

function TestCaseRow(props) {
  return (
    <TableRow key={props.id}>
      <TableCell align="center" component="th" scope="item">
        {props.id}
      </TableCell>
      <TableCell align="center">{props.visibility}</TableCell>
      <TableCell align="center">{props.timeout}</TableCell>
      <TableCell align="center">
        <Grid container spacing={24}>
          {/* <Grid item xs={3}>
            <SeeTestCases
              testCaseID={props.id}
              testCaseVisibility={props.visibility}
              tesetCaseTimeout={props.timeout}
            />
          </Grid> */}
          <Grid item xs={6}>
            <EditTestCaseInRow
              testCaseID={props.id}
              testCaseVisibility={props.visibility}
              tesetCaseTimeout={props.timeout}
            />
          </Grid>
          <Grid item xs={6}>
            <Tooltip title="Delete this test case">
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

TestCaseRow.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(TestCaseRow)
