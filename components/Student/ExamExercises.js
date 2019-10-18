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
import AssignmentIcon from '@material-ui/icons/Assignment'

import store from 'store'
import { handleAccessToken } from '../../auth'
import RubyExamExercise from '../Editors/RubyExamExercise.js'
import JavaExamExercise from '../Editors/JavaExamExercise.js'
import CExamExercise from '../Editors/CExamExercise.js'

import axios from 'axios'

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
    submissionID: '',
    examDescription: '',
    exercises: [],
    solutions: [],
    isLoaded: false
  }

  componentDidMount = async () => {
    const accessToken = await handleAccessToken()

    const examID = new URL(window.location.href).searchParams.get('examID')
    const submissionID = new URL(window.location.href).searchParams.get(
      'submissionID'
    )
    const examDescription = new URL(window.location.href).searchParams.get(
      'examDescription'
    )

    this.setState({
      examID: examID,
      examDescription: examDescription,
      submissionID: submissionID
    })

    // get all the exam exercises
    const url_exercises = `${process.env.API_HOST}/exams/${examID}/exercises`
    // get all the solutions of this submission
    const url_solutions = `${process.env.API_HOST}/solutions-submissions/${submissionID}/solutions`

    const headers = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + store.get('accessToken')
      }
    }

    axios
      .all([
        axios.get(url_exercises, headers),
        axios.get(url_solutions, headers)
      ])
      .then(
        axios.spread(async (exercises, solutions) => {
          //this will be executed only when all requests are complete
          const exercisesJSONResponse = await exercises.data
          const solutionsJSONResponse = await solutions.data

          console.log('Exercises: ', exercisesJSONResponse)
          console.log('Solutions: ', solutionsJSONResponse)

          this.setState({
            exercises: exercisesJSONResponse,
            solutions: solutionsJSONResponse,
            isLoaded: true
          })
          console.log('state ex', this.state.exercises)
          console.log('state sol', this.state.solutions)
        })
      )
      .catch(function(error) {
        console.log(error)
      })
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
          <Grid container spacing={24} alignItems="center">
            <Grid item xs={10}>
              <Typography variant="h4" style={{ margin: 20 }} gutterBottom>
                Examen: {this.state.examDescription}
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                // onClick={this.sendCodeinSandBox}
              >
                Entregar examen
                <AssignmentIcon className={classes.rightIcon} />
              </Button>
            </Grid>
          </Grid>
          <Divider
            style={{ marginTop: 40, marginBottom: 20 }}
            variant="middle"
          />
          {this.state.exercises.map((exercise, index) => {
            // search for the corresponding solution
            // const solution_ids = this.state.solutions.filter(solution => {
            //   console.log(
            //     "solution.exerciseId === exercise.id: ",
            //     solution.exerciseId === exercise.id
            //   );
            //   if (solution.exerciseId === exercise.id) {
            //     return solution.id;
            //   }
            // });

            return exercise.language.toString() === 'RUBY' ? (
              <div key={index}>
                <Typography style={{ margin: 20 }} variant="h5" gutterBottom>
                  Ejercicio: {index + 1}
                </Typography>
                <RubyExamExercise
                  solutionID={this.state.solutions.find(solution => {
                    return solution.exerciseId === exercise.id
                  })}
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
              <div key={index}>
                <Typography style={{ margin: 20 }} variant="h5" gutterBottom>
                  Ejercicio: {index + 1}
                </Typography>
                <JavaExamExercise
                  solutionID={this.state.solutions.find(solution => {
                    return solution.exerciseId === exercise.id
                  })}
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
              <div key={index}>
                <Typography style={{ margin: 20 }} variant="h5" gutterBottom>
                  Ejercicio: {index + 1}
                </Typography>
                <CExamExercise
                  solutionID={this.state.solutions.find(solution => {
                    return solution.exerciseId === exercise.id
                  })}
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
          })}
        </div>
      )
    }
  }
}

ExamExercises.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withSnackbar(withStyles(styles)(ExamExercises))
