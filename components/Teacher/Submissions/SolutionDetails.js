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
import SendIcon from '@material-ui/icons/Send'
import Router from 'next/router'
import { withSnackbar } from 'notistack'
import Divider from '@material-ui/core/Divider'

import ResultRow from './ResultRow.js'

import store from 'store'
import { handleAccessToken } from '../../../auth'
import axios from 'axios'

import dynamic from 'next/dynamic'
const CEditor = dynamic(import('../../Editors/CEditor'), { ssr: false })
const RubyEditor = dynamic(import('../../Editors/RubyEditor'), { ssr: false })
const JavaEditor = dynamic(import('../../Editors/JavaEditor'), { ssr: false })

const styles = theme => ({
  root: {
    width: '80%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto'
  }
})

class SolutionDetails extends React.Component {
  state = {
    exercise: {},
    submission: {},
    solution: {},
    isLoaded: false,
    submissionID: '',
    solutionID: '',
    exerciseID: '',
    results: []
  }

  componentWillMount = async () => {
    const accessToken = await handleAccessToken()
  }

  componentDidMount = () => {
    const submissionID = new URL(window.location.href).searchParams.get(
      'submissionID'
    )
    const solutionID = new URL(window.location.href).searchParams.get(
      'solutionID'
    )

    const exerciseID = new URL(window.location.href).searchParams.get(
      'exerciseID'
    )

    const url_exerciseID = `${process.env.API_HOST}/exercises/${exerciseID}`
    const url_submissionID = `${process.env.API_HOST}/solutions-submissions/${submissionID}`
    const url_solutionID = `${process.env.API_HOST}/solutions/${solutionID}`
    const url_results = `${process.env.API_HOST}/solutions/${solutionID}/results`

    fetch(url_results, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + store.get('accessToken')
      }
    })
      .then(async res => {
        console.log('Response status is: ', res.status)
        if (res.status === 200) {
          this.props.enqueueSnackbar(
            'Resultados de los test cases obtenidos.',
            {
              variant: 'success'
            }
          )
          const results = await res.json()
          console.log('results: ', results)

          this.setState({
            results: results
          })
        } else if (res.status === 422) {
          this.props.enqueueSnackbar(
            'No se puede obtener los resultados de test cases. Examen no entregado.',
            {
              variant: 'warning'
            }
          )
        } else {
          this.props.enqueueSnackbar(
            'Falló en traer los resultados de los test cases.',
            {
              variant: 'error'
            }
          )
        }
      })
      .catch(err => console.log(err))

    const headers = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + store.get('accessToken')
      }
    }

    axios
      .all([
        axios.get(url_exerciseID, headers),
        axios.get(url_submissionID, headers),
        axios.get(url_solutionID, headers)
        // axios.get(url_results, headers)
      ])
      .then(
        axios.spread(async (exercise, submission, solution, results) => {
          //this will be executed only when all requests are complete
          const exerciseJSONResponse = await exercise.data
          const submissionJSONResponse = await submission.data
          const solutionJSONResponse = await solution.data

          // console.log("Exercise: ", exerciseJSONResponse);
          // console.log("Submission: ", submissionJSONResponse);
          // console.log("Solution: ", solutionJSONResponse);

          this.setState({
            exercise: exerciseJSONResponse,
            submission: submissionJSONResponse,
            solution: solutionJSONResponse,
            isLoaded: true
          })
        })
      )
      .catch(function(error) {
        console.log(error)
      })
  }

  replayTestCase = (testCaseID, solutionID) => {
    // console.log("testCaseID: ", testCaseID);
    // console.log("solutionID: ", solutionID);

    const url = `${process.env.API_HOST}/solutions/${solutionID}/retry/test-case/${testCaseID}`

    fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + store.get('accessToken')
      }
    })
      .then(res => {
        if (res.status === 204) {
          this.props.enqueueSnackbar('Se envió a ejecutar nuevamente.', {
            variant: 'success'
          })
        } else if (res.status === 404) {
          this.props.enqueueSnackbar('No encontrado', {
            variant: 'warning'
          })
        } else {
          this.props.enqueueSnackbar('Falló enviar la ejecución nuevamente', {
            variant: 'error'
          })
        }
      })
      .catch(err => console.log(err))
  }

  runAllTestsAgain = () => {
    const url = `${process.env.API_HOST}/solutions/${this.state.solution.id}/retry`

    fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + store.get('accessToken')
      }
    })
      .then(res => {
        if (res.status === 204) {
          this.props.enqueueSnackbar(
            'Se enviaron a ejecutar nuevamente todos los test cases.',
            {
              variant: 'success'
            }
          )
        } else if (res.status === 404) {
          this.props.enqueueSnackbar('No encontrado', {
            variant: 'warning'
          })
        } else {
          this.props.enqueueSnackbar('Falló enviar la ejecución nuevamente', {
            variant: 'error'
          })
        }
      })
      .catch(err => console.log(err))
  }

  render() {
    const { classes } = this.props

    if (!this.state.isLoaded) {
      return <div>Cargando...</div>
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
          <Grid container spacing={24} alignItems="flex-start">
            <Grid item xs={4}>
              {/* ENTREGA */}
              <Typography variant="h5" style={{ margin: 20 }} gutterBottom>
                Entrega
              </Typography>
              <Typography variant="h6" style={{ margin: 20 }} gutterBottom>
                🔹ID: {this.state.submission.id}
              </Typography>
              <Typography variant="h6" style={{ margin: 20 }} gutterBottom>
                🔹Alumno: {this.state.submission.submitter}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              {/* EJERCICIO */}
              <Typography variant="h5" style={{ margin: 20 }} gutterBottom>
                Ejercicio
              </Typography>
              <Typography variant="h6" style={{ margin: 20 }} gutterBottom>
                🔹ID: {this.state.exercise.id}
              </Typography>
              <Typography variant="h6" style={{ margin: 20 }} gutterBottom>
                🔹Lenguaje: {this.state.exercise.language}
              </Typography>
              <Typography variant="h6" style={{ margin: 20 }} gutterBottom>
                🔹Puntaje: {this.state.exercise.awardedScore} puntos
              </Typography>
              <Typography variant="body1" style={{ margin: 20 }} gutterBottom>
                {this.state.exercise.question}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              {/* SOLUTION */}
              <Typography variant="h5" style={{ margin: 20 }} gutterBottom>
                Resolución del ejercicio
              </Typography>
              <Typography variant="h6" style={{ margin: 20 }} gutterBottom>
                🔹ID: {this.state.solution.id}
              </Typography>
              <Typography variant="h6" style={{ margin: 20 }} gutterBottom>
                🔹Compiler Flags:{' '}
                {this.state.solution.compilerFlags === null
                  ? ' - '
                  : this.state.solution.compilerFlags}
              </Typography>
            </Grid>
          </Grid>

          <Divider />

          <Typography variant="h6" style={{ margin: 20 }} gutterBottom>
            🔹Código:
          </Typography>
          {this.state.exercise.language === 'C' ? (
            <CEditor codeToRun={this.state.solution.answer} />
          ) : this.state.exercise.language === 'JAVA' ? (
            <JavaEditor codeToRun={this.state.solution.answer} />
          ) : (
            <RubyEditor codeToRun={this.state.solution.answer} />
          )}
          <Divider />

          {this.state.results.length === 0 ? (
            <div>
              <Typography variant="h5" style={{ margin: 20 }} gutterBottom>
                🔹No se muestran sus test cases pues no se ha entregado el
                examen aún.
              </Typography>
            </div>
          ) : (
            <div>
              <Typography variant="h5" style={{ margin: 20 }} gutterBottom>
                🔹Resultados de los test cases:
              </Typography>
              <Button
                variant="contained"
                color="primary"
                style={{ margin: 20 }}
                className={classes.button}
                onClick={this.runAllTestsAgain}
              >
                Correr todos los tests nuevamente
                <SendIcon className={classes.rightIcon} />
              </Button>
              <Paper style={{ margin: 20 }} className={classes.root}>
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center" style={{ maxWidth: '2px' }}>
                        Test Case ID
                      </TableCell>
                      <TableCell align="center">Resultado</TableCell>
                      <TableCell align="center">Comandos</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody align="center">
                    {this.state.results.map((result, index) => (
                      <ResultRow
                        key={index}
                        testCaseId={result.testCaseId}
                        result={result.result}
                        replayTestCase={this.replayTestCase.bind(
                          this,
                          result.testCaseId,
                          this.state.solution.id
                        )}
                      />
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            </div>
          )}
        </div>
      )
    }
  }
}

SolutionDetails.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withSnackbar(withStyles(styles)(SolutionDetails))
