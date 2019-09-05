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

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto'
  }
})

class ExamDashboard extends React.Component {
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
    console.log('windows', new URL(window.location.href))
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

  createExercise = () => {
    Router.push({
      pathname: `/create_exercises`,
      query: {
        examID: `${this.state.examID}`,
        examDescription: `${this.state.examDescription}`
      }
    })
  }

  deleteExercise = index => {
    if (window.confirm('Are you sure you want to delete this exercise?')) {
      this.props.enqueueSnackbar('Deleting exercise', { variant: 'info' })
      const url = `${process.env.API_HOST}/exercises/${this.state.exercises[
        index
      ].id.toString()}`

      fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + store.get('accessToken')
        }
      })
        .then(res => {
          if (res.status === 204) {
            this.props.enqueueSnackbar('Exercise deleted', {
              variant: 'success'
            })
            // Removes the desired item.
            this.state.exercises.splice(index, 1)
            this.setState({ exercises: this.state.exercises })
          } else if (res.status === 422) {
            this.props.enqueueSnackbar('Exam should be in UPCOMING state', {
              variant: 'warning'
            })
          } else {
            this.props.enqueueSnackbar('Failed to delete exam', {
              variant: 'error'
            })
          }
        })
        .catch(err => console.log(err))
    }
  }

  deleteAllExercises = index => {
    if (window.confirm('Are you sure you want to delete all the exercises?')) {
      this.props.enqueueSnackbar('Deleting all exercises', { variant: 'info' })
      const url = `${process.env.API_HOST}/exams/${this.state.examID}/exercises`

      fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + store.get('accessToken')
        }
      })
        .then(res => {
          if (res.status === 204) {
            this.props.enqueueSnackbar('All exercises deleted', {
              variant: 'success'
            })
            // Removes the desired item.
            this.state.exercises = []
            this.setState({ exercises: this.state.exercises })
          } else if (res.status === 422) {
            this.props.enqueueSnackbar('The exam is not in UPCOMING state.', {
              variant: 'warning'
            })
          } else {
            this.props.enqueueSnackbar('Failed to delete all exercises', {
              variant: 'error'
            })
          }
        })
        .catch(err => console.log(err))
    }
  }

  render() {
    const { classes } = this.props
    if (!this.state.isLoaded) {
      return <div>Loading...</div>
    } else if (this.state.exercises < 1) {
      return (
        <div>
          <Typography variant="h6" style={{ margin: 20 }} gutterBottom>
            You have no exercises created in this exam yet 🤷‍♂️
          </Typography>
          <Grid container spacing={24} alignItems="center">
            <Grid item xs={6}>
              <Button
                style={{ margin: 20 }}
                variant="contained"
                color="primary"
                onClick={this.createExercise}
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
          <Typography variant="h6" style={{ margin: 20 }} gutterBottom>
            Exercises of the exam: {this.state.examDescription}
          </Typography>
          <Grid container spacing={24} alignItems="center">
            <Grid item xs={6}>
              {this.state.examState === 'UPCOMING' ? (
                <div>
                  <Button
                    style={{ margin: 20 }}
                    variant="contained"
                    color="primary"
                    onClick={this.createExercise}
                  >
                    Add exercise to exam
                  </Button>
                  <Button
                    style={{ margin: 20 }}
                    variant="outlined"
                    color="primary"
                    onClick={this.deleteAllExercises}
                  >
                    Delete all exercises
                  </Button>
                </div>
              ) : (
                ''
              )}
            </Grid>
          </Grid>
          <Paper className={classes.root}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell align="center" style={{ maxWidth: '2px' }}>
                    Exercise ID
                  </TableCell>
                  <TableCell align="center">Question</TableCell>
                  <TableCell align="center">Language</TableCell>
                  <TableCell align="center">Awarded Score</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.exercises.map((exercise, index) => (
                  <ExerciseRow
                    key={index}
                    id={exercise.id}
                    question={exercise.question}
                    language={exercise.language}
                    solutionTemplate={exercise.solutionTemplate}
                    awardedScore={exercise.awardedScore}
                    deleteExercise={this.deleteExercise.bind(this, exercise.id)}
                    deleteAllExercises={this.deleteAllExercises.bind(this)}
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

ExamDashboard.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withSnackbar(withStyles(styles)(ExamDashboard))
