import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
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

class CreateExam extends Component {
  state = {
    username: '',
    password: ''
  }
  componentWillMount = async () => {
    const accessToken = await handleAccessToken()
    console.log('Access token is: ', store.get('accessToken'))
  }

  onUsernameChange = username => {
    this.setState({ username: username.target.value })
  }

  onPasswordChange = password => {
    this.setState({ password: password.target.value })
  }

  createUser = () => {
    console.log(
      'POST sent this: ',
      JSON.stringify({
        username: this.state.username,
        password: this.state.password
      })
    )

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
        Router.push(`/users_dashboard`)
      })
      .catch(err => console.log(err))
  }

  render() {
    return (
      <div>
        <Typography style={{ margin: 20 }} variant="h5" gutterBottom>
          Create a user
        </Typography>
        <Grid container spacing={24} alignItems="center">
          <Grid item xs={6}>
            <TextField
              id="outlined-name"
              label="Username"
              placeholder="Example: username123"
              style={{ margin: 20 }}
              onChange={this.onUsernameChange}
              value={this.state.username}
              fullWidth
              margin="normal"
              variant="outlined"
            />
          </Grid>
        </Grid>
        <Grid container spacing={24} alignItems="center">
          <Grid item xs={6}>
            <TextField
              id="outlined-name"
              label="Password"
              type="password"
              style={{ margin: 20 }}
              onChange={this.onPasswordChange}
              value={this.state.password}
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
              onClick={this.createUser}
            >
              Create user
            </Button>
          </Grid>
        </Grid>
      </div>
    )
  }
}

CreateExam.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(CreateExam)