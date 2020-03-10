import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import EditIcon from '@material-ui/icons/Edit'
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

class EditExerciseInRow extends React.Component {
  modifyExerciseHandler = () => {
    Router.push({
      pathname: `/modify_exercise`,
      query: {
        exerciseID: `${this.props.exerciseID}`,
        exerciseQuestion: `${this.props.exerciseQuestion}`,
        exerciseLanguage: `${this.props.exerciseLanguage}`,
        exerciseSolutionTemplate: `${this.props.exerciseSolutionTemplate}`,
        exerciseAwardedScore: `${this.props.exerciseAwardedScore}`
      }
    })
  }

  render() {
    const { classes } = this.props
    return (
      <div>
        <Tooltip title="Editar ejercicio">
          <IconButton
            className={classes.button}
            // className={classes.margin}
            aria-label="Edit"
            size="small"
            onClick={this.modifyExerciseHandler}
            color="primary"
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
      </div>
    )
  }
}

EditExerciseInRow.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(EditExerciseInRow)
