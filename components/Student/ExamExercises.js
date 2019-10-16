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
import Divider from '@material-ui/core/Divider'

import store from 'store'
import { handleAccessToken } from '../../auth'
import RubyExamExercise from '../Editors/RubyExamExercise.js'
import JavaExamExercise from '../Editors/JavaExamExercise.js'
import CExamExercise from '../Editors/CExamExercise.js'

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
    exercises: [],
    isLoaded: false
  }

  componentWillMount = async () => {
    const accessToken = await handleAccessToken()
  }

  componentDidMount = () => {
    const examID = new URL(window.location.href).searchParams.get('examID')
    const examDescription = new URL(window.location.href).searchParams.get(
      'examDescription'
    )
    const url = `${process.env.API_HOST}/exams/${examID}/exercises`

    this.setState({
      examID: examID,
      examDescription: examDescription
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
      return <div>Cargando...</div>
    } else if (this.state.exercises < 1) {
      return (
        <div>
          <Typography variant="h6" style={{ margin: 20 }} gutterBottom>
            Este examen no tiene ejercicios 🤷‍♂️
          </Typography>
        </div>
      )
    } else {
      return (
        <div>
          <Typography variant="h4" style={{ margin: 20 }} gutterBottom>
            Examen: {this.state.examDescription}
          </Typography>
          {this.state.exercises.map((exercise, index) =>
            exercise.language.toString() === 'RUBY' ? (
              <div>
                <Typography style={{ margin: 20 }} variant="h5" gutterBottom>
                  Ejercicio: {index + 1}
                </Typography>
                <RubyExamExercise
                  question={exercise.question}
                  solutionTemplate={exercise.solutionTemplate}
                  awardedScore={exercise.awardedScore}
                />
                <Divider
                  style={{ marginTop: 40, marginBottom: 20 }}
                  variant="middle"
                />
              </div>
            ) : exercise.language.toString() === 'JAVA' ? (
              <div>
                <Typography style={{ margin: 20 }} variant="h5" gutterBottom>
                  Ejercicio: {index + 1}
                </Typography>
                <JavaExamExercise
                  question={exercise.question}
                  solutionTemplate={exercise.solutionTemplate}
                  awardedScore={exercise.awardedScore}
                />
                <Divider
                  style={{ marginTop: 40, marginBottom: 20 }}
                  variant="middle"
                />
              </div>
            ) : (
              <div>
                <Typography style={{ margin: 20 }} variant="h5" gutterBottom>
                  Ejercicio: {index + 1}
                </Typography>
                <CExamExercise
                  question={exercise.question}
                  solutionTemplate={exercise.solutionTemplate}
                  awardedScore={exercise.awardedScore}
                />
                <Divider
                  style={{ marginTop: 40, marginBottom: 20 }}
                  variant="middle"
                />
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
