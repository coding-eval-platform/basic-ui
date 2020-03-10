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
import axios from 'axios'

const styles = theme => ({
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  }
})

class LTIRegistrationForm extends Component {
  state = {
    examID: '',
    examCreationState: ''
  }

  componentDidMount = () => {
    const examCreationState = new URL(window.location.href).searchParams.get(
      'exam-creation-state'
    )

    this.setState({
      examCreationState: examCreationState
    })
  }

  onExamIdChange = examID => {
    this.setState({ examID: examID.target.value })
  }

  registerExam = async () => {
    console.log(
      'registrando: ',
      JSON.stringify({
        examID: this.state.examID,
        examCreationState: this.state.examCreationState
      })
    )
    this.props.enqueueSnackbar('Registrando examen', { variant: 'info' })
    const url = `${process.env.API_HOST}/lti/app/create-exam-finish`
    // const url = `${process.env.JUAN_HOST}/lti/app/create-exam-finish`;

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        // Authorization: "Bearer " + store.get("accessToken")
      },
      body: JSON.stringify({
        examID: this.state.examID,
        examCreationState: this.state.examCreationState
      })
    })
      .then(async res => {
        if (res.status === 201) {
          this.props.enqueueSnackbar('Primer paso enviado', {
            variant: 'success'
          })

          ltiResponse = await res.json()
          console.log('JuanRESPONSE: ', res.body)

          const options = {
            'Content-Type': 'application/x-www-form-urlencoded'
          }

          const data = {
            jwt: ltiResponse.jwt
          }

          axios.post(`${ltiResponse.endpoint}`, data, options).then(res => {
            console.log(res)
            console.log(res.data)
          })
        } else {
          this.props.enqueueSnackbar('Falló al registrar el examen', {
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
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={6}>
            <TextField
              id="outlined-password"
              label="Insertar ID del examen"
              placeholder="123123123"
              style={{ margin: 20 }}
              onChange={this.onExamIdChange}
              value={this.state.examID}
              fullWidth
              margin="normal"
              variant="outlined"
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={6}>
            <Button
              style={{ margin: 20 }}
              variant="contained"
              color="primary"
              onClick={this.registerExam}
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
