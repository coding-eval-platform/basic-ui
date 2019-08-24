import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'

import Router from 'next/router'
import { MuiPickersUtilsProvider, DateTimePicker } from 'material-ui-pickers'
import MomentUtils from '@date-io/moment'
import moment from 'moment'

import Typography from '@material-ui/core/Typography'

import store from 'store'
import { handleAccessToken } from '../../auth'

const styles = theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  }
})

class ModifyUser extends Component {
  state = {
    username: '',
    roles: []
  }
  componentWillMount = async () => {
    const accessToken = await handleAccessToken()
    console.log('Access token is: ', store.get('accessToken'))
  }

  componentDidMount = () => {
    const username = new URL(window.location.href).searchParams.get('username')
    const url = `${process.env.API_HOST}/users/${username}`

    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + store.get('accessToken')
      }
    })
      .then(async res => {
        const userJSONResponse = await res.json()
        console.log('The user to be updated is: ', userJSONResponse)

        this.setState({
          username: userJSONResponse.username,
          roles: userJSONResponse.roles
        })
      })
      .catch(err => console.log(err))
  }

  onRolesChange = roles => {
    this.setState({ roles: roles.target.value })
  }

  updateUser = () => {
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
          Edit user roles for: {this.state.username}
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
          <Grid item xs={3}>
            <TextField
              id="outlined-name"
              label="Exam duration (mins)"
              placeholder="Example: 120"
              style={{ margin: 20 }}
              onChange={this.onDurationChange}
              value={this.state.duration}
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
              onClick={this.updateUser}
            >
              Edit roles
            </Button>
          </Grid>
        </Grid>
      </div>
    )
  }
}

ModifyUser.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(ModifyUser)
