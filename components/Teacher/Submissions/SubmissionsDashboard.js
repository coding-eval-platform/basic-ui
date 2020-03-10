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

import SubmitterRow from './SubmitterRow.js'

import store from 'store'
import { handleAccessToken } from '../../../auth'

const styles = theme => ({
  root: {
    width: '80%',
    marginTop: theme.spacing(3),
    overflowX: 'auto'
  }
})

class SubmissionsDashboard extends React.Component {
  state = {
    submitters: [],
    isLoaded: false
  }

  componentWillUnmount = () => {
    clearInterval(this.interval)
  }

  componentDidMount = () => {
    this.interval = setInterval(() => {
      handleAccessToken()
    }, 15 * 1000)

    const examID = new URL(window.location.href).searchParams.get('examID')
    const url = `${process.env.API_HOST}/exams/${examID}/solutions-submissions`

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
          submitters: outputJSONResponse
        })
      })
      .catch(err => console.log(err))
  }

  viewExamExercises = (index, submitter) => {
    const submissionID = this.state.submitters[index].id
    const url = `${process.env.API_HOST}/solutions-submissions/${submissionID}/solutions`

    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + store.get('accessToken')
      }
    })
      .then(res => {
        if (res.status === 200) {
          Router.push({
            pathname: `/submission_details`,
            query: {
              submissionID: submissionID,
              submitter: submitter
            }
          })
        } else {
          this.props.enqueueSnackbar(
            'Falló ver los ejercicios de ese examen.',
            {
              variant: 'error'
            }
          )
        }
      })
      .catch(err => console.log(err))
  }

  getMarkFromSubmitter = (index, submissionID) => {
    const url = `${process.env.API_HOST}/solutions-submissions/${submissionID}`

    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + store.get('accessToken')
      }
    })
      .then(async res => {
        if (res.status === 200) {
          this.props.enqueueSnackbar('Puntuaje actualizado.', {
            variant: 'success'
          })

          const submitterObtained = await res.json()
          console.log('submitterObtained', submitterObtained)
          // remove old one
          this.state.submitters.splice(index, 1)
          const newSubmitters = this.state.submitters
          // add new one
          newSubmitters.push(submitterObtained)
          this.setState({ submitters: newSubmitters })
        } else {
          this.props.enqueueSnackbar('Falló puntuar el examen.', {
            variant: 'error'
          })
        }
      })
      .catch(err => console.log(err))
  }

  markExamHandler = index => {
    this.props.enqueueSnackbar('Puntuando examen', { variant: 'info' })
    const submissionID = this.state.submitters[index].id
    const url = `${process.env.API_HOST}/solutions-submissions/${submissionID}/score`

    fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + store.get('accessToken')
      }
    })
      .then(res => {
        if (res.status === 204) {
          this.getMarkFromSubmitter(index, submissionID)
          // this.props.enqueueSnackbar("Examen puntuado.", {
          //   variant: "success"
          // });
        } else if (res.status === 404) {
          this.props.enqueueSnackbar('Examen no encontrado', {
            variant: 'error'
          })
        } else {
          this.props.enqueueSnackbar(
            'Falló al puntuar el examen: posiblemente el alumno no haya entregado aún.',
            {
              variant: 'error'
            }
          )
        }
      })
      .catch(err => console.log(err))
  }

  render() {
    const { classes } = this.props
    if (!this.state.isLoaded) {
      return <div>Cargando...</div>
    } else if (this.state.submitters < 1) {
      return (
        <div>
          <Grid container spacing={2} alignItems="center">
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
          <Typography variant="h6" style={{ margin: 20 }} gutterBottom>
            No tiene alumnos registrados en el examen aún 🤷‍♂️
          </Typography>
        </div>
      )
    } else {
      return (
        <div>
          <Grid container spacing={2} alignItems="center">
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
          <Typography variant="h6" style={{ margin: 20 }} gutterBottom>
            Los alumnos registrados son:
          </Typography>
          <Paper style={{ margin: 20 }} className={classes.root}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell align="center" style={{ maxWidth: '2px' }}>
                    ID del alumno
                  </TableCell>
                  <TableCell align="center">Nombre del alumno</TableCell>
                  {/* <TableCell align="center">Language</TableCell>
                  <TableCell align="center">Awarded Score</TableCell> */}
                  <TableCell align="center">Puntaje</TableCell>
                  <TableCell align="center">Comandos</TableCell>
                </TableRow>
              </TableHead>
              <TableBody align="center">
                {this.state.submitters.map((submitter, index) => (
                  // console.log("submitter ", submitter)
                  <SubmitterRow
                    key={index}
                    submitterID={submitter.id}
                    submitter={submitter.submitter}
                    score={
                      submitter.score === null
                        ? '-'
                        : submitter.score.toString()
                    }
                    viewExercisesEvent={this.viewExamExercises.bind(
                      this,
                      index,
                      submitter.submitter
                    )}
                    markExamEvent={this.markExamHandler.bind(this, index)}
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

SubmissionsDashboard.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withSnackbar(withStyles(styles)(SubmissionsDashboard))
