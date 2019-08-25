import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'

import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import AddCircle from '@material-ui/icons/AddCircle'
import Tooltip from '@material-ui/core/Tooltip'

import Router from 'next/router'

import Typography from '@material-ui/core/Typography'

import store from 'store'
import { handleAccessToken } from '../../auth'

import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import ListItemText from '@material-ui/core/ListItemText'
import Select from '@material-ui/core/Select'
import Checkbox from '@material-ui/core/Checkbox'

const styles = theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
    maxWidth: 300
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

  removeRole = role => {}

  addRole = role => {}

  updateRoles = () => {
    this.props.enqueueSnackbar('Updating roles', {
      variant: 'info'
    })
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
          this.props.enqueueSnackbar('Roles updated', { variant: 'success' })
          Router.push(`/users_dashboard`)
        } else {
          this.props.enqueueSnackbar('Failed to update roles.', {
            variant: 'error'
          })
        }
      })
      .catch(err => console.log(err))
  }

  render() {
    const roles = ['ADMIN', 'TEACHER', 'STUDENT']
    const ITEM_HEIGHT = 48
    const ITEM_PADDING_TOP = 8
    const MenuProps = {
      PaperProps: {
        style: {
          maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
          width: 250
        }
      }
    }
    const { classes } = this.props

    return (
      <div>
        <Grid container spacing={24} alignItems="center">
          <Grid item xs={6}>
            <Button
              style={{ margin: 20 }}
              variant="outlined"
              color="primary"
              onClick={() => {
                Router.push(`/users_dashboard`)
              }}
            >
              Back to users dashboard
            </Button>
          </Grid>
        </Grid>
        <Typography style={{ margin: 20 }} variant="h5" gutterBottom>
          Edit user roles for: {this.state.username}
        </Typography>
        <Grid container spacing={24} alignItems="center">
          <Grid item xs={3} style={{ margin: 20 }}>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="select-multiple-checkbox">
                Edit the roles listed here
              </InputLabel>
              <Select
                style={{ minWidth: '30em' }}
                multiple
                fullWidth
                value={this.state.roles}
                onChange={this.onRolesChange}
                input={<Input id="select-multiple-checkbox" />}
                renderValue={selected => selected.join(',')}
                MenuProps={MenuProps}
              >
                {roles.map(role => (
                  <MenuItem key={role} value={role}>
                    <Checkbox checked={this.state.roles.indexOf(role) > -1} />
                    <ListItemText primary={role} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <div>
          <Grid container spacing={24} style={{ margin: 20 }}>
            {this.state.roles.map(role => (
              <div key={role}>
                <Grid container spacing={24} style={{ margin: 20 }}>
                  <Grid item xs={2}>
                    <Typography variant="h6">{role}</Typography>
                  </Grid>
                  <Grid container spacing={24}>
                    <Grid item xs={2}>
                      <Tooltip title="Add this role">
                        <IconButton aria-label="Add" onClick={this.addRole}>
                          <AddCircle />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                    <Grid item xs={2}>
                      <Tooltip title="Remove this role">
                        <IconButton
                          aria-label="Delete"
                          onClick={this.removeRole}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </Grid>
              </div>
            ))}
          </Grid>
        </div>
      </div>
    )
  }
}

ModifyUser.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(ModifyUser)
