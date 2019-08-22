import React from 'react'
import { withStyles, Grid, TextField, Button } from '@material-ui/core'
import { withSnackbar } from 'notistack'
import { Face, Fingerprint } from '@material-ui/icons'
import Router from 'next/router'
import store from 'store'

import { handleAccessToken } from '../../auth'

const styles = theme => ({
  margin: {
    margin: theme.spacing.unit * 2
  },
  padding: {
    padding: theme.spacing.unit
  }
})

class SignUpForm extends React.Component {
  state = {
    username: '',
    password: '',
    password2: ''
  }

  componentWillMount = async () => {
    const accessToken = await handleAccessToken()
    console.log('Doing signup: ', store.get('accessToken'))
  }

  onUsernameChange = username => {
    this.setState({ username: username.target.value })
  }

  onPasswordChange = password => {
    this.setState({ password: password.target.value })
  }

  onPassword2Change = password2 => {
    this.setState({ password2: password2.target.value })
  }

  createUser = () => {
    // const accessToken = await handleAccessToken();
    console.log('fruta: ', 'Bearer ' + store.get('accessToken'))

    this.props.enqueueSnackbar('Creating user', { variant: 'info' })
    fetch(`${process.env.API_HOST}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + store.get('accessToken')
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password
      })
    })
      .then(res => {
        console.log('Response status is: ', res.status)
        if (res.status === 201) {
          this.props.enqueueSnackbar('User created', { variant: 'success' })
          Router.push(`/`)
        } else {
          this.props.enqueueSnackbar('User failed to be created', {
            variant: 'error'
          })
        }
      })
      .catch(err => console.log(err))
  }

  render() {
    const { classes } = this.props

    return (
      <div className={classes.margin}>
        {/* <Paper className={classes.padding}> */}
        {/* Username */}
        <Grid container spacing={8} alignItems="flex-end">
          <Grid item>
            <Face />
          </Grid>
          <Grid item md={true} sm={true} xs={true}>
            <TextField
              id="username"
              label="Username"
              type="email"
              value={this.state.username}
              onChange={this.onUsernameChange}
              fullWidth
              autoFocus
              required
            />
          </Grid>
        </Grid>

        {/* Password */}
        <Grid container spacing={8} alignItems="flex-end">
          <Grid item>
            <Fingerprint />
          </Grid>
          <Grid item md={true} sm={true} xs={true}>
            <TextField
              id="password"
              label="Password"
              type="password"
              value={this.state.password}
              onChange={this.onPasswordChange}
              fullWidth
              required
            />
          </Grid>
        </Grid>

        {/* Confirm Password */}
        <Grid container spacing={8} alignItems="flex-end">
          <Grid item>
            <Fingerprint />
          </Grid>
          <Grid item md={true} sm={true} xs={true}>
            <TextField
              id="password-confirmation"
              label="Re-enter password"
              type="password"
              value={this.state.password2}
              onChange={this.onPassword2Change}
              fullWidth
              required
            />
          </Grid>
        </Grid>

        <Grid container justify="center" style={{ marginTop: '10px' }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={this.createUser}
            style={{ textTransform: 'none' }}
          >
            Sign Up
          </Button>
        </Grid>
      </div>
    )
  }
}

export default withSnackbar(withStyles(styles)(SignUpForm))
