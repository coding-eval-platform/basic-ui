import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import EditIcon from '@material-ui/icons/Edit'
import Router from 'next/router'

const styles = theme => ({
  margin: {
    margin: theme.spacing.unit
  },
  appBar: {
    position: 'relative'
  },
  flex: {
    flex: 1
  }
})

class EditTestCaseInRow extends React.Component {
  modifyTestCaseHandler = () => {
    Router.push({
      pathname: `/modify_testcase`,
      query: {
        exerciseID: `${this.props.exerciseID}`,
        exerciseQuestion: `${this.props.exerciseQuestion}`,
        testCaseID: `${this.props.testCaseID}`,
        visibility: `${this.props.testCaseVisibility}`,
        timeout: `${this.props.tesetCaseTimeout}`,
        programArguments: `${this.props.testCaseInputs}`,
        expectedOutputs: `${this.props.testCaseExpectedOutputs}`
      }
    })
  }

  render() {
    const { classes } = this.props
    return (
      <div>
        <Tooltip title="Editar este test case">
          <IconButton
            className={classes.button}
            aria-label="Edit"
            size="small"
            onClick={this.modifyTestCaseHandler}
            color="primary"
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
      </div>
    )
  }
}

EditTestCaseInRow.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(EditTestCaseInRow)
