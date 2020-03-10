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

class SeeExercises extends React.Component {
  seeExercisesHandler = () => {
    Router.push({
      pathname: `/exam_dashboard`,
      query: {
        examID: `${this.props.id}`,
        examDescription: `${this.props.description}`,
        examStartingAt: `${this.props.startingAt}`,
        examState: `${this.props.state}`
      }
    })
  }

  render() {
    const { classes } = this.props
    return (
      <div>
        <Tooltip title="Ver ejercicios">
          <IconButton
            className={classes.button}
            aria-label="SeeExercises"
            size="small"
            onClick={this.seeExercisesHandler}
            color="primary"
          >
            <FormatListNumberedIcon />
          </IconButton>
        </Tooltip>
      </div>
    )
  }
}

SeeExercises.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(SeeExercises)
