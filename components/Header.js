import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import RenderButton from './RenderButton'

import store from 'store'

const styles = {
  root: {
    flexGrow: 1
  },
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  }
}

class Header extends Component {
  render() {
    const { classes } = this.props

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              className={classes.menuButton}
              color="inherit"
              aria-label="Menu"
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" className={classes.grow}>
              Coding Evaluation Platform
            </Typography>
            <RenderButton href="/" content="Home" />
            {/* <RenderButton href='/about' content='About'/> */}

            {/* {store.get('username') === undefined ? (
              <RenderButton href="/signup" content="Sign Up" />
            ) : (
              ''
            )} */}

            {store.get('username') === undefined ? (
              <RenderButton href="/login" content="Login" />
            ) : (
              ''
            )}

            {/* <RenderButton href="/teacher_dashboard" content="Teacher" /> */}
            <RenderButton href="/playground" content="Playground" />
            <RenderButton href="/student-login" content="Student" />
            <RenderButton href="/lti-exam-registration" content="LTI" />
            <RenderButton href="/takeexam" content="Take Exam" />
            {/* <RenderButton href='/create_exam' content='Create Exam'/> */}
            {/* <RenderButton href='/create_exercises' content='Create Exercises'/> */}
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Header)
