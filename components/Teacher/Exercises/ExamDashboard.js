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
import Modal from 'react-awesome-modal'

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
    examState: '',
    exercises: [],
    isLoaded: false,
    visibleDeleteOne: false,
    visibleDeleteAll: false,
    index: ''
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

  createExercise = () => {
    Router.push({
      pathname: `/create_exercises`,
      query: {
        examID: `${this.state.examID}`,
        examDescription: `${this.state.examDescription}`
      }
    })
  }

  openDeleteOneModal = index => {
    this.setState({
      visibleDeleteOne: true,
      index: index
    })
  }

  closeDeleteOneModal() {
    this.setState({
      visibleDeleteOne: false,
      index: ''
    })
  }

  openDeleteAllModal() {
    this.setState({
      visibleDeleteAll: true
    })
  }

  closeDeleteAllModal() {
    this.setState({
      visibleDeleteAll: false
    })
  }

  deleteExercise = index => {
    console.log('deleting', index)
    this.props.enqueueSnackbar('Borrando ejercicio', { variant: 'info' })
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
          this.props.enqueueSnackbar('Ejercicio borrado', {
            variant: 'success'
          })
          // Removes the desired item.
          this.state.exercises.splice(index, 1)
          this.setState({ exercises: this.state.exercises })
        } else if (res.status === 422) {
          this.props.enqueueSnackbar(
            'El examen debería estar en estado UPCOMING',
            {
              variant: 'warning'
            }
          )
        } else {
          this.props.enqueueSnackbar('Falló en borrar ejercicio', {
            variant: 'error'
          })
        }
      })
      .catch(err => console.log(err))
  }

  deleteAllExercises = index => {
    this.props.enqueueSnackbar('Borrando todos los ejercicios', {
      variant: 'info'
    })
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
          this.props.enqueueSnackbar('Todos los ejercicios borrados', {
            variant: 'success'
          })
          // Removes the desired item.
          this.state.exercises = []
          this.setState({ exercises: this.state.exercises })
        } else if (res.status === 422) {
          this.props.enqueueSnackbar(
            'El examen debería estar en estado UPCOMING',
            {
              variant: 'warning'
            }
          )
        } else {
          this.props.enqueueSnackbar('Falló en borrar todos los ejercicios', {
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
    } else if (this.state.exercises < 1) {
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
          <Typography variant="h6" style={{ margin: 20 }} gutterBottom>
            No tiene ejercicios creados aún 🤷‍♂️
          </Typography>
          <Grid container spacing={24} alignItems="center">
            <Grid item xs={6}>
              <Button
                style={{ margin: 20 }}
                variant="contained"
                color="primary"
                onClick={this.createExercise}
              >
                Crear uno!
              </Button>
            </Grid>
          </Grid>
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
          {/* <Typography variant="h6" style={{ margin: 20 }} gutterBottom>
            Exam status: {this.state.examState}
          </Typography> */}
          <Typography variant="h6" style={{ margin: 20 }} gutterBottom>
            Ejercicios del examen: {this.state.examDescription}
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
                    Agregar ejercicio al examen
                  </Button>
                  <Button
                    style={{ margin: 20 }}
                    variant="outlined"
                    color="secondary"
                    onClick={this.openDeleteAllModal.bind(this)}
                  >
                    Borrar todos los ejercicios
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
                  <TableCell align="center">Pregunta</TableCell>
                  <TableCell align="center">Lenguaje</TableCell>
                  <TableCell align="center">Puntaje</TableCell>
                  <TableCell align="center">Comandos</TableCell>
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
                    deleteEvent={this.openDeleteOneModal.bind(this, index)}
                  />
                ))}
              </TableBody>

              {/* DELETE ONE MODAL */}
              <Modal
                visible={this.state.visibleDeleteOne}
                width="400"
                height="200"
                effect="fadeInUp"
                onClickAway={() => this.closeDeleteOneModal()}
              >
                <Typography
                  variant="h5"
                  style={{ margin: '20px 0px 0px 20px' }}
                  gutterBottom
                >
                  Borrar ejercicio
                </Typography>
                <Typography
                  variant="body1"
                  style={{ margin: '20px' }}
                  gutterBottom
                >
                  Está seguro que desa borrar el ejercicio? Click SI para
                  borrarlo, click afuera del recuadro para salir.
                </Typography>
                <Button
                  style={{ marginLeft: '20px' }}
                  variant="outlined"
                  color="secondary"
                  onClick={() => {
                    this.deleteExercise(this.state.index)
                  }}
                >
                  Si, borrar ejercicio
                </Button>
              </Modal>

              {/* DELETE ALL MODAL */}
              <Modal
                visible={this.state.visibleDeleteAll}
                width="400"
                height="200"
                effect="fadeInUp"
                onClickAway={() => this.closeDeleteAllModal()}
              >
                <Typography
                  variant="h5"
                  style={{ margin: '20px 0px 0px 20px' }}
                  gutterBottom
                >
                  Borrar todos los ejercicios
                </Typography>
                <Typography
                  variant="body1"
                  style={{ margin: '20px' }}
                  gutterBottom
                >
                  Está seguro que desa borrar todos los ejercicios? Click SI
                  para borrarlos, click afuera del recuadro para salir.
                </Typography>
                <Button
                  style={{ marginLeft: '20px' }}
                  variant="outlined"
                  color="secondary"
                  onClick={() => {
                    this.deleteAllExercises()
                  }}
                >
                  Si, borrar todos los ejercicios
                </Button>
              </Modal>
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
