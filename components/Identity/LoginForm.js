import React from 'react'
import { withStyles, Grid, TextField, Button } from '@material-ui/core'
import { withSnackbar } from 'notistack'
import { Face, Fingerprint } from '@material-ui/icons'
import Router from 'next/router'
import store from 'store'

// import { handleAccessToken } from "../../auth";

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
    // const accessToken = await handleAccessToken();
  }

  onUsernameChange = username => {
    this.setState({ username: username.target.value })
  }

  onPasswordChange = password => {
    this.setState({ password: password.target.value })
  }

  loginUser = () => {
    this.props.enqueueSnackbar('Logging in', { variant: 'info' })
    fetch(`${process.env.API_HOST}/tokens`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password
      })
    })
      .then(async res => {
        if (res.status === 201) {
          console.log('Response status is: ', res.status)
          const response = await res.json()
          store.set('tokenId', response.id)
          store.set('accessToken', response.accessToken)
          store.set('refreshToken', response.refreshToken)
          store.set(
            'username',
            JSON.parse(atob(response.accessToken.split('.')[1])).sub
          )
          store.set(
            'roles',
            JSON.parse(atob(response.accessToken.split('.')[1])).roles
          )
          this.props.enqueueSnackbar('Logged in!', { variant: 'success' })
          Router.push(`/`)
        } else {
          console.log('Response status is: ', res.status)
          this.props.enqueueSnackbar('Unauthorized', {
            variant: 'error'
          })
          // Router.push(`/forbidden`);
        }
      })
      .catch(err => console.log(err))
  }

  render() {
    const { classes } = this.props

    return (
      <div className={classes.margin}>
        {/* <Paper className={classes.padding}> */}

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

export default withSnackbar(withStyles(styles)(LoginForm))
