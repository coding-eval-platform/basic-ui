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
  }
  // appBar: {
  //   position: 'relative'
  // },
  // flex: {
  //   flex: 1
  // }
})

class EditUserInRow extends React.Component {
  modifyUserHandler = () => {
    Router.push({
      pathname: `/modify_user`,
      query: {
        username: `${this.props.username}`
      }
    })
  }

  render() {
    const { classes } = this.props
    return (
      <div>
        <Tooltip title="Editar usuario">
          <IconButton
            className={classes.button}
            aria-label="Edit"
            size="small"
            onClick={this.modifyUserHandler}
            color="primary"
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
      </div>
    )
  }
}

EditUserInRow.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(EditUserInRow)
