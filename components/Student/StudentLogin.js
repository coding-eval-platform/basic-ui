import React from 'react'
import { withStyles, Grid, TextField, Button } from '@material-ui/core'
import { withSnackbar } from 'notistack'
import { Face, Fingerprint } from '@material-ui/icons'
import Moment from 'react-moment'
import Router from 'next/router'
import store from 'store'
import Typography from '@material-ui/core/Typography'

import { handleAccessToken } from '../../auth'

const styles = theme => ({
  margin: {
    margin: theme.spacing.unit * 2
  },
  padding: {
    padding: theme.spacing.unit
  }
})

class StudentLogin extends React.Component {
  state = {
    description: '',
    duration: '',
    examID: '20',
    startingAt: ''
  }

  componentWillMount = async () => {
    const accessToken = await handleAccessToken()

    const url = `${process.env.API_HOST}/exams/${this.state.examID}`

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

  convertHMS = value => {
    const sec = parseInt(value, 10) // convert value to number if it's string
    let hours = Math.floor(sec / 3600) // get hours
    let minutes = Math.floor((sec - hours * 3600) / 60) // get minutes
    let seconds = sec - hours * 3600 - minutes * 60 //  get seconds
    // add 0 if value < 10
    if (hours < 10) {
      hours = '0' + hours
    }
    if (minutes < 10) {
      minutes = '0' + minutes
    }
    if (seconds < 10) {
      seconds = '0' + seconds
    }
    // return hours+':'+minutes+':'+seconds; // Return is HH : MM : SS
    // return hours+'days '+minutes+'hs '+seconds + 'mins';
    return minutes + 'hs ' + seconds + 'mins'
  }

  onUsernameChange = username => {
    this.setState({ username: username.target.value })
  }

  onPasswordChange = password => {
    this.setState({ password: password.target.value })
  }

  startExam = () => {
    const url = `${process.env.API_HOST}/exams/${this.state.examID}/solutions-submissions`

    this.props.enqueueSnackbar('Ingresando al examen', { variant: 'info' })
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + store.get('accessToken')
      }
    })
      .then(res => {
        console.log('Response status is: ', res.status)
        if (res.status === 201) {
          this.props.enqueueSnackbar('Entrada aceptada.', {
            variant: 'success'
          })
          let submission_id = res.headers.get('Location').split('/')
          submission_id = submission_id[submission_id.length - 1]

          // Router.push({
          //   pathname: `/exam_dashboard`,
          //   query: {
          //     examID: `${submission_id}`,
          //     examDescription: `${this.state.description}`,
          //     examState: 'UPCOMING'
          //   }
          // })
        } else if (res.status === 422) {
          this.props.enqueueSnackbar(
            'No puede entrar aún. El examen no comenzó.',
            {
              variant: 'warning'
            }
          )
        } else {
          this.props.enqueueSnackbar('Falló el ingreso al examen.', {
            variant: 'error'
          })
        }
      })
      .catch(err => console.log(err))
  }

  render() {
    const { classes } = this.props

    return (
      <div className={classes.margin}>
        <Typography style={{ margin: 8 }} variant="h5" gutterBottom>
          Examen: {this.state.description}
        </Typography>
        <Typography style={{ margin: 8 }} variant="h5" gutterBottom>
          Duración: {this.convertHMS(this.state.duration)}
        </Typography>
        <Typography style={{ margin: 8 }} variant="h5" gutterBottom>
          Comienzo: <Moment format="LLL">{this.state.startingAt}</Moment>
        </Typography>
        <Grid container style={{ margin: 8 }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={this.startExam}
            style={{ textTransform: 'none' }}
          >
            Comenzar Examen
          </Button>
        </Grid>
      </div>
    )
  }
}

export default withSnackbar(withStyles(styles)(StudentLogin))
