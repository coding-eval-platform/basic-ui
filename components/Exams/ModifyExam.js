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

class ModifyExam extends Component {
  state = {
    examID: '',
    examState: '',
    description: '',
    startingAt: '',
    duration: ''
  }

  componentWillMount = async () => {
    const accessToken = await handleAccessToken()
  }

  componentDidMount = () => {
    const examID = new URL(window.location.href).searchParams.get('examID')
    const examState = new URL(window.location.href).searchParams.get(
      'examState'
    )
    const examDescription = new URL(window.location.href).searchParams.get(
      'examDescription'
    )

    this.setState({
      examID: examID,
      examState: examState,
      description: examDescription
    })

    const url = `${process.env.API_HOST}/exams/${examID}`

    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + store.get('accessToken')
      }
    })
      .then(async res => {
        const examJSONResponse = await res.json()

        this.setState({
          examID: examJSONResponse.id,
          description: examJSONResponse.description,
          startingAt: examJSONResponse.startingAt,
          duration: examJSONResponse.duration
        })
      })
      .catch(err => console.log(err))
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

  updateExam = () => {
    const url = `${process.env.API_HOST}/exams/${this.state.examID}`

    this.props.enqueueSnackbar('Modifying exam', { variant: 'info' })
    fetch(url, {
      method: 'PUT',
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
        if (res.status === 204) {
          this.props.enqueueSnackbar('Exam modified.', {
            variant: 'success'
          })
          Router.push(`/teacher_dashboard`)
        } else if (res.status === 422) {
          this.props.enqueueSnackbar('The exam is not in UPCOMING state.', {
            variant: 'warning'
          })
        } else {
          this.props.enqueueSnackbar('Failed to modify exam.', {
            variant: 'error'
          })
        }
      })
      .catch(err => console.log(err))
  }

  addExercise = () => {
    Router.push({
      pathname: `/create_exercises`,
      query: {
        examID: `${this.state.examID}`,
        examState: `${this.state.examState}`,
        examDescription: `${this.state.description}`
      }
    })
  }

  seeExercises = () => {
    Router.push({
      pathname: `/exam_dashboard`,
      query: {
        examID: `${this.state.examID}`,
        examState: `${this.state.examState}`,
        examDescription: `${this.state.description}`
      }
    })
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
              Go back
            </Button>
          </Grid>
        </Grid>
        <Typography style={{ margin: 20 }} variant="h5" gutterBottom>
          Update the exam: {this.state.description}
        </Typography>
        <Typography style={{ margin: 20 }} variant="h6" gutterBottom>
          Exam status: {this.state.examState}
        </Typography>
        <Grid container spacing={24} alignItems="center">
          <Grid item xs={6}>
            <TextField
              id="outlined-name"
              label="Exam title"
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
              label="Exam duration (mins)"
              style={{ margin: 20 }}
              onChange={this.onDurationChange}
              value={this.state.duration}
              fullWidth
              margin="normal"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={3}>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <DateTimePicker
                label="Insert date and time"
                value={this.state.startingAt}
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
              variant="outlined"
              color="primary"
              onClick={this.addExercise}
            >
              Add an exercise to the exam
            </Button>
          </Grid>
        </Grid>
        <Grid container spacing={24} alignItems="center">
          <Grid item xs={6}>
            <Button
              style={{ margin: 20 }}
              variant="outlined"
              color="primary"
              onClick={this.seeExercises}
            >
              View and edit exercises
            </Button>
          </Grid>
        </Grid>
        <Grid container spacing={24} alignItems="center">
          <Grid item xs={6}>
            <Button
              style={{ margin: 20 }}
              variant="contained"
              color="primary"
              onClick={this.updateExam}
            >
              Modify exam
            </Button>
          </Grid>
        </Grid>
      </div>
    )
  }
}

ModifyExam.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withSnackbar(withStyles(styles)(ModifyExam))
