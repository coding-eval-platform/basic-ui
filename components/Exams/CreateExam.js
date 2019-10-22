import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { withSnackbar } from 'notistack'
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

class CreateExam extends Component {
  state = {
    description: '',
    startingAt: '2019-10-06T15:00:00',
    duration: ''
  }
  componentWillMount = async () => {
    const accessToken = await handleAccessToken()
  }

  onDescriptionChange = description => {
    this.setState({ description: description.target.value })
  }

  onDurationChange = duration => {
    this.setState({ duration: duration.target.value })
  }

  onDateTimeChange = startingAt => {
    this.setState({
      startingAt: moment(startingAt._d).format('YYYY-MM-DDTHH:mm:ss')
    })
  }

  createExam = () => {
    const url = `${process.env.API_HOST}/exams`

    this.props.enqueueSnackbar('Creando examen', { variant: 'info' })
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + store.get('accessToken')
      },
      body: JSON.stringify({
        description: this.state.description,
        duration: this.state.duration,
        startingAt: this.state.startingAt
      })
    })
      .then(res => {
        console.log('Response status is: ', res.status)
        if (res.status === 201) {
          this.props.enqueueSnackbar('Examen creado.', {
            variant: 'success'
          })
          let exam_id = res.headers.get('Location').split('/')
          exam_id = exam_id[exam_id.length - 1]

          // Router.push({
          //   pathname: `/exam_dashboard`,
          //   query: {
          //     examID: `${exam_id}`,
          //     examDescription: `${this.state.description}`,
          //     examState: 'UPCOMING'
          //   }
          // })
        } else if (res.status === 422) {
          this.props.enqueueSnackbar('El examen no puede estar en el pasado.', {
            variant: 'warning'
          })
        } else {
          this.props.enqueueSnackbar('Falló la creación del examen.', {
            variant: 'error'
          })
        }
      })
      .catch(err => console.log(err))
  }

  render() {
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
          Crear un examen
        </Typography>
        <Grid container spacing={24} alignItems="center">
          <Grid item xs={6}>
            <TextField
              id="outlined-name"
              label="Título del examen"
              placeholder="Ejemplo: Primer Parcial de OOP"
              style={{ margin: 20 }}
              onChange={this.onDescriptionChange}
              value={this.state.description}
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
              label="Duración (mins)"
              placeholder="Ejemplo: 120"
              style={{ margin: 20 }}
              onChange={this.onDurationChange}
              value={this.state.duration}
              fullWidth
              margin="normal"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={3}>
            {/* <TextField
              id="datetime-local"
              label="Insert date and time"
              type="datetime-local"
              style={{ margin: 20 }}
              defaultValue="2017-05-24T10:30"
              // value={props.data.startingAt}
              // InputLabelProps={{
              //   shrink: true
              // }}
            /> */}
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <DateTimePicker
                label="Inserte fecha y hora"
                value={this.state.startingAt}
                fullWidth
                style={{ margin: 20 }}
                onChange={this.onDateTimeChange}
              />
            </MuiPickersUtilsProvider>
          </Grid>
        </Grid>
        <Grid container spacing={24} alignItems="center">
          <Grid item xs={6}>
            <Button
              style={{ margin: 20 }}
              variant="contained"
              color="primary"
              onClick={this.createExam}
            >
              Crear examen
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

export default withSnackbar(withStyles(styles)(CreateExam))
