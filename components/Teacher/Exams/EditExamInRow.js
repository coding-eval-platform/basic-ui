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

class EditExamInRow extends React.Component {
  modifyExamHandler = () => {
    Router.push({
      pathname: `/modify_exam`,
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
        <Tooltip title="Editar el examen">
          <IconButton
            className={classes.button}
            aria-label="Edit"
            size="small"
            onClick={this.modifyExamHandler}
            color="primary"
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
      </div>
    )
  }
}

EditExamInRow.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(EditExamInRow)
