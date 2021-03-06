import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'

import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import AddCircle from '@material-ui/icons/AddCircle'
import Tooltip from '@material-ui/core/Tooltip'
import { withSnackbar } from 'notistack'
import Router from 'next/router'

import Typography from '@material-ui/core/Typography'

import store from 'store'
import { handleAccessToken } from '../../auth'

import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
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
    realRoles: [],
    roles: [],
    active: ''
  }

  componentWillUnmount = () => {
    clearInterval(this.interval)
  }

  componentDidMount = () => {
    this.interval = setInterval(() => {
      handleAccessToken()
    }, 15 * 1000)

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

        this.setState({
          username: userJSONResponse.username,
          realRoles: userJSONResponse.roles,
          roles: userJSONResponse.roles,
          active: userJSONResponse.active
        })
      })
      .catch(err => console.log(err))
  }

  onRolesChange = roles => {
    this.setState({ roles: roles.target.value })
  }

  handleActivenessChange = name => event => {
    this.setState({ ...this.state, [name]: event.target.checked })

    switch (this.state.active) {
      case false:
        // ACTIVATE3
        // console.log("Activating user");
        this.props.enqueueSnackbar(`Activando usuario`, {
          variant: 'info'
        })
        fetch(`${process.env.API_HOST}/users/${this.state.username}/active`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + store.get('accessToken')
          }
        })
          .then(res => {
            // console.log("Response status is: ", res.status);
            if (res.status === 204) {
              this.props.enqueueSnackbar(`Usuario activado`, {
                variant: 'success'
              })
            } else {
              this.props.enqueueSnackbar('Falló al activar el usuario', {
                variant: 'error'
              })
            }
          })
          .catch(err => console.log(err))
        break

      case true:
        // INACTIVATE
        // console.log("Deactivating user");
        this.props.enqueueSnackbar(`Desactivando usuario`, {
          variant: 'info'
        })
        fetch(`${process.env.API_HOST}/users/${this.state.username}/active`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + store.get('accessToken')
          }
        })
          .then(res => {
            // console.log("Response status is: ", res.status);
            if (res.status === 204) {
              this.props.enqueueSnackbar(`Usuario desactivado`, {
                variant: 'success'
              })
            } else {
              this.props.enqueueSnackbar('Falló al desactivar el usuario', {
                variant: 'error'
              })
            }
          })
          .catch(err => console.log(err))
        break
    }
  }

  removeRole = (index, event) => {
    if (!this.state.realRoles.includes(this.state.roles[index])) {
      this.props.enqueueSnackbar(
        `El usuario no contiene el rol de ${this.state.roles[index]}`,
        {
          variant: 'warning'
        }
      )
    } else {
      // console.log("Eliminando el rol: ", this.state.roles[index]);
      this.props.enqueueSnackbar(
        `Eliminando el rol de ${this.state.roles[index]}`,
        {
          variant: 'info'
        }
      )
      fetch(
        `${process.env.API_HOST}/users/${this.state.username}/roles/${this.state.roles[index]}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + store.get('accessToken')
          }
        }
      )
        .then(res => {
          // console.log("Response status is: ", res.status);
          if (res.status === 204) {
            this.props.enqueueSnackbar(
              `${this.state.roles[index]} rol eliminado.`,
              { variant: 'success' }
            )
          } else {
            this.props.enqueueSnackbar('Falló al eliminar el rol', {
              variant: 'error'
            })
          }
        })
        .catch(err => console.log(err))
    }
  }

  addRole = (index, event) => {
    if (this.state.realRoles.includes(this.state.roles[index])) {
      this.props.enqueueSnackbar(
        `El usuario ya tiene el rol de ${this.state.roles[index]}`,
        {
          variant: 'warning'
        }
      )
    } else {
      // console.log("Agregando el rol de ", this.state.roles[index]);
      this.props.enqueueSnackbar(
        `Agregando el rol de ${this.state.roles[index]}`,
        {
          variant: 'info'
        }
      )
      fetch(
        `${process.env.API_HOST}/users/${this.state.username}/roles/${this.state.roles[index]}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + store.get('accessToken')
          }
        }
      )
        .then(res => {
          // console.log("Response status is: ", res.status);
          if (res.status === 204) {
            this.props.enqueueSnackbar(
              `${this.state.roles[index]} rol agregado`,
              {
                variant: 'success'
              }
            )
            this.state.realRoles.push(this.state.roles[index])
            let newRoles = this.state.realRoles
            console.log('newRoles', newRoles)
            this.setState({
              realRoles: newRoles
            })
          } else {
            this.props.enqueueSnackbar('Falló al agregar el rol.', {
              variant: 'error'
            })
          }
        })
        .catch(err => console.log(err))
    }
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
                Router.back()
              }}
            >
              Ir atrás
            </Button>
          </Grid>
        </Grid>
        <Typography style={{ margin: 20 }} variant="h5" gutterBottom>
          Editar usuario: {this.state.username}
          <FormControlLabel
            style={{ margin: 20 }}
            control={
              <Switch
                checked={this.state.active}
                onChange={this.handleActivenessChange('active')}
                // value={'active'}
              />
            }
            label="Activar usuario"
          />
        </Typography>
        <Grid container spacing={24} alignItems="center">
          <Grid item xs={3} style={{ margin: 20 }}>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="select-multiple-checkbox">
                Editar los roles listados a continuación
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
            {this.state.roles.map((role, index) => (
              <div key={role}>
                <Grid container spacing={24} style={{ margin: 20 }}>
                  <Grid item xs={2}>
                    <Typography variant="h6">{role}</Typography>
                  </Grid>
                  <Grid container spacing={24}>
                    <Grid item xs={2}>
                      <Tooltip title="Agregar rol">
                        <IconButton
                          aria-label="Add"
                          onClick={this.addRole.bind(this, index)}
                        >
                          <AddCircle />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                    <Grid item xs={2}>
                      <Tooltip title="Eliminar rol">
                        <IconButton
                          aria-label="Delete"
                          onClick={this.removeRole.bind(this, index)}
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

export default withSnackbar(withStyles(styles)(ModifyUser))
