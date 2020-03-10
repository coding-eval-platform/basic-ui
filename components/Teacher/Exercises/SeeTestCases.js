import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered'
import Router from 'next/router'

const styles = theme => ({
  margin: {
    margin: theme.spacing(1)
  },
  appBar: {
    position: 'relative'
  },
  flex: {
    flex: 1
  }
})

class SeeTestCases extends React.Component {
  seeTestCasesHandler = () => {
    Router.push({
      pathname: `/exercise_dashboard`,
      query: {
        exerciseID: `${this.props.exerciseID}`,
        exerciseQuestion: `${this.props.exerciseQuestion}`
      }
    })
  }

  render() {
    const { classes } = this.props
    return (
      <div>
        <Tooltip title="Ver test cases">
          <IconButton
            className={classes.button}
            // className={classes.margin}
            aria-label="SeeTestCases"
            size="small"
            onClick={this.seeTestCasesHandler}
            color="primary"
          >
            <FormatListNumberedIcon />
          </IconButton>
        </Tooltip>
      </div>
    )
  }
}

SeeTestCases.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(SeeTestCases)
