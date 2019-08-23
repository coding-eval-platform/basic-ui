import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
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
    console.log('Access token is: ', store.get('accessToken'))
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
        console.log('The JSON with all the exercises is: ', outputJSONResponse)

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

  deleteExercise = (index, event) => {
    if (window.confirm('Are you sure you want to delete this exercise?')) {
      console.log('Deleting exercise with ID: ', this.state.exercises[index].id)

      const url = `${process.env.API_HOST}/exercises/${this.state.exercises[
        index
      ].id.toString()}`

      // Removes the desired item.
      this.state.exercises.splice(index, 1)
      // console.log("LOS exercises DE AHORA SON: ", this.state.exercises);
      this.setState({ exercises: this.state.exercises })

      // then hit the API
      fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + store.get('accessToken')
        }
      })
        .then(res => res.text()) // OR res.json()
        .then(res => console.log(res))
    }
  }

  editExercise = examId => {
    if (window.confirm('Are you sure you want to start this exam?')) {
      const exercises = Object.assign([], this.state.exercises)
      console.log(exercises)

      this.setState(state => {
        const exercises = state.exercises.map(exam => {
          if (exam.id === examId) {
            console.log('el exam es: ', exam)
            // hit API endpoint here

            let url = `${
              process.env.API_HOST
            }/exams/${exam.id.toString()}/start`

            // Change the exam here
            exam.state = 'IN_PROGRESS'

            fetch(url, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + store.get('accessToken')
              },
              body: JSON.stringify({
                description: 'STARTED',
                startingAt: '2019-10-06T15:00:00',
                duration: 'PT150M'
              })
            })
              .then(res => res.text()) // OR res.json()
              .then(res => console.log(res))
            return exam
          } else {
            return exam
          }
        })

        // SEE NEW STATE
        console.log(exercises)
        // CHANGE THE STATE
        return {
          exercises
        }
      })
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
              <Button
                style={{ margin: 20 }}
                variant="contained"
                color="primary"
                onClick={this.createExercise}
              >
                Add exercise to exam
              </Button>
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
                    deleteEvent={this.deleteExercise.bind(this, index)}
                    editExercise={this.editExercise.bind(this, exercise.id)}
                    deleteExercise={this.deleteExercise.bind(this, exercise.id)}
                    // changeEvent={this.changeUserName.bind(this, user.description)}
                    // key={user.id }
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

export default withStyles(styles)(ExamDashboard)
