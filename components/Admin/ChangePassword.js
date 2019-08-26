import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import { withSnackbar } from 'notistack'
import Button from '@material-ui/core/Button'

import Router from 'next/router'
import Typography from '@material-ui/core/Typography'

import store from 'store'
import { handleAccessToken } from '../../auth'

const styles = theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  }
})

class ChangePassword extends Component {
  state = {
    currentPassword: '',
    newPassword: ''
  }

  componentWillMount = async () => {
    const accessToken = await handleAccessToken()
    // console.log('Access token is: ', store.get('accessToken'))
  }

  onCurrentPasswordChange = currentPassword => {
    this.setState({ currentPassword: currentPassword.target.value })
  }

  onNewPasswordChange = newPassword => {
    this.setState({ newPassword: newPassword.target.value })
  }

  changePassword = () => {
    const username = new URL(window.location.href).searchParams.get('username')
    const url = `${process.env.API_HOST}/users/${username}/password`

    this.props.enqueueSnackbar('Changing password', { variant: 'info' })
    fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + store.get('accessToken')
      },
      body: JSON.stringify({
        currentPassword: this.state.currentPassword,
        newPassword: this.state.newPassword
      })
    })
      .then(res => {
        if (res.status === 204) {
          this.props.enqueueSnackbar('Password changed', { variant: 'success' })
        } else if (res.status === 422) {
          this.props.enqueueSnackbar('Weak Password', {
            variant: 'error'
          })
        } else {
          this.props.enqueueSnackbar('Failed to change password', {
            variant: 'error'
          })
        }
      })
      .catch(err => console.log(err))
  }

  render() {
    const { classes } = this.props

    return (
      <div>
        <Typography style={{ margin: 20 }} variant="h5" gutterBottom>
          Change password
        </Typography>
        <Grid container spacing={24} alignItems="center">
          <Grid item xs={6}>
            <TextField
              id="outlined-currentpassword"
              label="Current password"
              type="password"
              style={{ margin: 20 }}
              onChange={this.onCurrentPasswordChange}
              value={this.state.currentPassword}
              fullWidth
              margin="normal"
              variant="outlined"
            />
          </Grid>
        </Grid>
        <Grid container spacing={24} alignItems="center">
          <Grid item xs={6}>
            <TextField
              id="outlined-newpassword"
              label="New Password"
              type="password"
              style={{ margin: 20 }}
              onChange={this.onNewPasswordChange}
              value={this.state.newPassword}
              fullWidth
              margin="normal"
              variant="outlined"
            />
          </Grid>
        </Grid>
        <Grid container spacing={24} alignItems="center">
          <Grid item xs={6}>
            <Button
              style={{ margin: 20 }}
              variant="contained"
              color="primary"
              onClick={this.changePassword}
            >
              Change Password
            </Button>
          </Grid>
        </Grid>
      </div>
    )
  }
}

ChangePassword.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withSnackbar(withStyles(styles)(ChangePassword))
