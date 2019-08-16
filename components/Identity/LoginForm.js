import React from 'react'
import { withStyles, Grid, TextField, Button } from '@material-ui/core'
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

class LoginForm extends React.Component {
  state = {
    username: '',
    password: ''
  }

  componentWillMount = async () => {
    const accessToken = await handleAccessToken()
    console.log('Doing login: ', store.get('accessToken'))
  }

  onUsernameChange = username => {
    this.setState({ username: username.target.value })
  }

  onPasswordChange = password => {
    this.setState({ password: password.target.value })
  }

  loginUser = () => {
    // const accessToken = await handleAccessToken();
    console.log('fruta: ', 'Bearer ' + store.get('accessToken'))

    fetch(`${process.env.API_HOST}/tokens`, {
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
        if (res.status === 201) {
          console.log('Response status is: ', res.status)
          Router.push(`/playground`)
        } else {
          console.log('Response status is: ', res.status)
          Router.push(`/forbidden`)
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

        <Grid container justify="center" style={{ marginTop: '10px' }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={this.loginUser}
            style={{ textTransform: 'none' }}
          >
            Login
          </Button>
        </Grid>
      </div>
    )
  }
}

export default withStyles(styles)(LoginForm)
