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

class LTIRegistrationForm extends Component {
  state = {
    examID: ''
  }

  onExamIdChange = examID => {
    this.setState({ examID: examID.target.value })
  }

  registerExam = () => {
    this.props.enqueueSnackbar('Registrando examen', { variant: 'info' })
    const url = 'asdasdaasda'

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + store.get('accessToken')
      },
      body: JSON.stringify({
        examID: this.state.examID
      })
    })
      .then(res => {
        if (res.status === 201) {
          this.props.enqueueSnackbar('Usuario creado', { variant: 'success' })
          // Router.push(`/users_dashboard`)
        } else if (res.status === 422) {
          this.props.enqueueSnackbar('Contraseña débil', {
            variant: 'error'
          })
        } else {
          this.props.enqueueSnackbar('Falló al crear un usuario', {
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
          Registrar examen con LTI
        </Typography>
        <Grid container spacing={24} alignItems="center">
          <Grid item xs={6}>
            <TextField
              id="outlined-password"
              label="Insertar ID del examen"
              placeholder="123123123"
              style={{ margin: 20 }}
              onChange={this.registerExam}
              value={this.state.examID}
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
              Registrar examen
            </Button>
          </Grid>
        </Grid>
      </div>
    )
  }
}

LTIRegistrationForm.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withSnackbar(withStyles(styles)(LTIRegistrationForm))
