import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'

import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Router from 'next/router'
import { withSnackbar } from 'notistack'

import UserRow from './UserRow.js'

import store from 'store'
import { handleAccessToken } from '../../auth'

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto'
  }
})

class UsersDashboard extends React.Component {
  state = {
    users: [],
    isLoaded: false
  }

  componentWillMount = async () => {
    const accessToken = await handleAccessToken()
    // console.log('Access token is: ', store.get('accessToken'))
  }

  componentDidMount = () => {
    const url = `${process.env.API_HOST}/users`

    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + store.get('accessToken')
      }
    })
      .then(async res => {
        const outputJSONResponse = await res.json()
        console.log('The JSON with all the users is: ', outputJSONResponse)

        this.setState({
          isLoaded: true,
          users: outputJSONResponse
        })
      })
      .catch(err => console.log(err))
  }

  createUser = () => {
    Router.push(`/create_user`)
  }

  deleteUser = (index, event) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      console.log('Deleting username: ', this.state.users[index].username)
      this.props.enqueueSnackbar(
        `Deleting ${this.state.users[index].username}`,
        {
          variant: 'info'
        }
      )

      const url = `${process.env.API_HOST}/users/${this.state.users[index].username}`

      // then hit the API
      fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + store.get('accessToken')
        },
        body: JSON.stringify({
          username: this.state.users[index].username
        })
      })
        .then(res => {
          console.log('Response status is: ', res.status)
          if (res.status === 204) {
            this.props.enqueueSnackbar(
              `${this.state.users[index].username} removed`,
              { variant: 'success' }
            )
            // Removes the desired item.
            this.state.users.splice(index, 1)
            // console.log("LOS users DE AHORA SON: ", this.state.users);
            this.setState({ users: this.state.users })
          } else {
            this.props.enqueueSnackbar('Failed to delete user.', {
              variant: 'error'
            })
          }
        })
        .catch(err => console.log(err))
    }
  }

  editUserActiveness = username => {
    if (window.confirm('Are you sure you want to edit this user?')) {
      const users = Object.assign([], this.state.users)

      this.setState(state => {
        const users = state.users.map(user => {
          if (user.username === username) {
            console.log('el user es: ', user)
            // hit API endpoint here

            if (user.active) {
              let url = `${
                process.env.API_HOST
              }/users/${user.username.toString()}/active`

              // Change the user here
              user.active = true

              fetch(url, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer ' + store.get('accessToken')
                },
                body: JSON.stringify({
                  username: user.username
                })
              })
                .then(res => res.json())
                .then(res => console.log(res))
            } else {
              let url = `${
                process.env.API_HOST
              }/users/${user.username.toString()}/active`

              // Change the user here
              user.active = false

              fetch(url, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer ' + store.get('accessToken')
                },
                body: JSON.stringify({
                  username: user.username
                })
              })
                .then(res => res.json())
                .then(res => console.log(res))
            }
            return user
          } else {
            return user
          }
        })

        // SEE NEW STATE
        console.log(users)
        // CHANGE THE STATE
        return {
          users
        }
      })
    }
  }

  render() {
    const { classes } = this.props
    if (!this.state.isLoaded) {
      return <div>Loading...</div>
    } else if (this.state.users < 1) {
      return (
        <div>
          <Typography variant="h6" style={{ margin: 20 }} gutterBottom>
            You have no users created yet 🤷‍♂️
          </Typography>
          <Grid container spacing={24} alignItems="center">
            <Grid item xs={6}>
              <Button
                style={{ margin: 20 }}
                variant="contained"
                color="primary"
                onClick={this.createUser}
              >
                Create one!
              </Button>
            </Grid>
          </Grid>
        </div>
      )
    } else {
      return (
        <div>
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
          <Typography variant="h6" style={{ margin: 20 }} gutterBottom>
            Here are all the users
          </Typography>
          <Paper className={classes.root}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell align="center" style={{ maxWidth: '2px' }}>
                    Username
                  </TableCell>
                  <TableCell align="center">Is Active?</TableCell>
                  {/* <TableCell align="center">Language</TableCell>
                  <TableCell align="center">Awarded Score</TableCell> */}
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.users.map((user, index) => (
                  <UserRow
                    key={index}
                    username={user.username}
                    active={user.active}
                    editUserActiveness={this.editUserActiveness.bind(
                      this,
                      user.username,
                      user.active
                    )}
                    deleteEvent={this.deleteUser.bind(this, index)}
                  />
                ))}
              </TableBody>
            </Table>
          </Paper>
        </div>
      )
    }
  }
}

UsersDashboard.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withSnackbar(withStyles(styles)(UsersDashboard))
