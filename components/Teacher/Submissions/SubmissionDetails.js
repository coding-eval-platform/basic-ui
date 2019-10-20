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
import Modal from 'react-awesome-modal'
import { withSnackbar } from 'notistack'

import SubmissionExerciseRow from './SubmissionExerciseRow.js'

import store from 'store'
import { handleAccessToken } from '../../../auth'

const styles = theme => ({
  root: {
    width: '60%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto'
  }
})

class SubmissionDetails extends React.Component {
  state = {
    solutions: [],
    isLoaded: false,
    // visibleDelete: false,
    // index: "",
    submitter: '',
    submissionID: ''
  }

  componentWillMount = async () => {
    const accessToken = await handleAccessToken()
  }

  componentDidMount = () => {
    const submissionID = new URL(window.location.href).searchParams.get(
      'submissionID'
    )
    const submitter = new URL(window.location.href).searchParams.get(
      'submitter'
    )
    const url = `${process.env.API_HOST}/solutions-submissions/${submissionID}/solutions`

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
          solutions: outputJSONResponse,
          submitter: submitter,
          submissionID: submissionID
        })
      })
      .catch(err => console.log(err))
  }

  viewSolutionDetail = (solutionID, exerciseID) => {
    console.log('SolutionID: ', solutionID)
    console.log('ExerciseID: ', exerciseID)

    Router.push({
      pathname: `/solution-details`,
      query: {
        submissionID: `${this.state.submissionID}`,
        solutionID: solutionID,
        exerciseID: exerciseID
      }
    })
  }

  render() {
    const { classes } = this.props
    if (!this.state.isLoaded) {
      return <div>Cargando...</div>
    } else if (this.state.solutions < 1) {
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
          {/* This case should never actually happen to be honest */}
          <Typography variant="h6" style={{ margin: 20 }} gutterBottom>
            No tiene ejercicios entregados en el examen aún 🤷‍♂️
          </Typography>
        </div>
      )
    } else {
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
          {/* <Grid container spacing={24} alignItems="center">
            <Grid item xs={6}>
              <Button
                style={{ margin: 20 }}
                variant="contained"
                color="primary"
                onClick={this.createUser}
              >
                Crear usuario
              </Button>
            </Grid>
          </Grid> */}
          <Typography variant="h6" style={{ margin: 20 }} gutterBottom>
            Los ejercicios entregados del alumno {this.state.submitter} son:
          </Typography>
          <Paper style={{ margin: 20 }} className={classes.root}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell align="center" style={{ maxWidth: '2px' }}>
                    Solution ID
                  </TableCell>
                  <TableCell align="center">ID del ejercicio</TableCell>
                  <TableCell align="center">Compiler Flags</TableCell>
                  <TableCell align="center">Comandos</TableCell>
                </TableRow>
              </TableHead>
              <TableBody align="center">
                {this.state.solutions.map((solution, index) => (
                  <SubmissionExerciseRow
                    key={index}
                    solutionID={solution.id}
                    exerciseID={solution.exerciseId}
                    answer={solution.answer}
                    compilerFlags={solution.compilerFlags || '-'}
                    viewSolutionDetail={this.viewSolutionDetail.bind(
                      this,
                      solution.id,
                      solution.exerciseId
                    )}
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

SubmissionDetails.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withSnackbar(withStyles(styles)(SubmissionDetails))
