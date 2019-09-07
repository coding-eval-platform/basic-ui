import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { withSnackbar } from 'notistack'
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

import ExerciseRow from './ExerciseRow.js'

import store from 'store'
import { handleAccessToken } from '../../../auth'
import JavaPlaygroundExercise from '../Editors/JavaPlaygroundExercise.js'
import RubyPlaygroundExercise from '../Editors/RubyPlaygroundExercise.js'
import CPlaygroundExercise from '../Editors/CPlaygroundExercise.js'

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto'
  }
})

class ExamExercises extends React.Component {
  state = {
    examID: '',
    examDescription: '',
    examState: '',
    exercises: [],
    isLoaded: false
  }

  componentWillMount = async () => {
    const accessToken = await handleAccessToken()
    // hacer un POST y guardar el resultado de:
  }

  componentDidMount = () => {
    const examID = new URL(window.location.href).searchParams.get('examID')
    const examState = new URL(window.location.href).searchParams.get(
      'examState'
    )
    const examDescription = new URL(window.location.href).searchParams.get(
      'examDescription'
    )
    const url = `${process.env.API_HOST}/exams/${examID}/exercises`

    this.setState({
      examID: examID,
      examDescription: examDescription,
      examState: examState
    })

    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + store.get('accessToken')
      }
    })
      .then(async res => {
        const outputJSONResponse = await res.json()

        this.setState({
          isLoaded: true,
          exercises: outputJSONResponse
        })
      })
      .catch(err => console.log(err))
  }

  render() {
    const { classes } = this.props
    if (!this.state.isLoaded) {
      return <div>Loading...</div>
    } else if (this.state.exercises < 1) {
      return (
        <div>
          <Typography variant="h6" style={{ margin: 20 }} gutterBottom>
            This exam has no exercises 🤷‍♂️
          </Typography>
        </div>
      )
    } else {
      return (
        <div>
          <Typography variant="h6" style={{ margin: 20 }} gutterBottom>
            Exam status: {this.state.examState}
          </Typography>
          <Typography variant="h6" style={{ margin: 20 }} gutterBottom>
            Exercises of the exam: {this.state.examDescription}
          </Typography>
          {this.state.exercises.map(exercise =>
            exercise.language.toString() === 'RUBY' ? (
              <div>
                <Typography variant="h6" style={{ margin: 20 }} gutterBottom>
                  Question: {exercise.question}
                </Typography>
                <Typography variant="h6" style={{ margin: 20 }} gutterBottom>
                  Score: {exercise.awardedScore}
                </Typography>
                <RubyPlaygroundExercise />
              </div>
            ) : exercise.language.toString() === 'JAVA' ? (
              <div>
                <Typography variant="h6" style={{ margin: 20 }} gutterBottom>
                  Question: {exercise.question}
                </Typography>
                <Typography variant="h6" style={{ margin: 20 }} gutterBottom>
                  Score: {exercise.awardedScore}
                </Typography>
                <JavaPlaygroundExercise />
              </div>
            ) : (
              <div>
                <Typography variant="h6" style={{ margin: 20 }} gutterBottom>
                  Question: {exercise.question}
                </Typography>
                <Typography variant="h6" style={{ margin: 20 }} gutterBottom>
                  Score: {exercise.awardedScore}
                </Typography>
                <CPlaygroundExercise />
              </div>
            )
          )}
        </div>
      )
    }
  }
}

ExamExercises.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withSnackbar(withStyles(styles)(ExamExercises))
