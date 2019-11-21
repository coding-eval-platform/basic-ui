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

import ExamRow from './ExamRow.js'
import store from 'store'
import { handleAccessToken } from '../../../auth'
import { withSnackbar } from 'notistack'
import Modal from 'react-awesome-modal'

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto'
  }
})

class TeacherDashboard extends React.Component {
  state = {
    exams: [],
    isLoaded: false,
    visibleDelete: false,
    visibleStart: false,
    visibleStop: false,
    index: ''
  }

  componentWillUnmount = () => {
    clearInterval(this.interval)
  }

  componentDidMount = () => {
    this.interval = setInterval(() => {
      handleAccessToken()
    }, 15 * 1000)

    const url = `${process.env.API_HOST}/exams?size=100&page=0&sort=description,asc`

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
          exams: outputJSONResponse
        })
      })
      .catch(err => console.log(err))
  }

  deleteExam = index => {
    this.props.enqueueSnackbar('Borrando examen', { variant: 'info' })
    const url = `${process.env.API_HOST}/exams/${this.state.exams[
      index
    ].id.toString()}`

    // then hit the API
    fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + store.get('accessToken')
      }
    })
      .then(res => {
        if (res.status === 204) {
          this.props.enqueueSnackbar('Examen borrado', { variant: 'success' })
          // Removes the desired item.
          this.state.exams.splice(index, 1)
          this.setState({ exams: this.state.exams })
        } else if (res.status === 422) {
          this.props.enqueueSnackbar(
            'El examen debería estar en estado UPCOMING',
            {
              variant: 'warning'
            }
          )
        } else {
          this.props.enqueueSnackbar('Falló en borrar el examen', {
            variant: 'error'
          })
        }
      })
      .catch(err => console.log(err))
  }

  startExamHandler = index => {
    console.log('Starting exam with ID: ', this.state.exams[index].id)
    this.props.enqueueSnackbar('Comenzando examen', { variant: 'info' })
    const url = `${process.env.API_HOST}/exams/${this.state.exams[
      index
    ].id.toString()}/start`

    // then hit the API
    fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + store.get('accessToken')
      }
    })
      .then(res => {
        if (res.status === 204) {
          this.props.enqueueSnackbar('Examen comenzado', {
            variant: 'success'
          })
          // Change the state in that item
          this.state.exams[index].state = 'IN_PROGRESS'
          this.setState({ exams: this.state.exams })
        } else if (res.status === 422) {
          if (
            this.state.exams[index].state.toString() === 'FINISHED' ||
            this.state.exams[index].state.toString() === 'IN_PROGRESS'
          ) {
            this.props.enqueueSnackbar(
              'El examen debería estar en estado UPCOMING',
              {
                variant: 'warning'
              }
            )
          } else {
            this.props.enqueueSnackbar(
              'El examen no tiene ejercicios o algún ejercicio no tiene private test cases.',
              {
                variant: 'warning'
              }
            )
          }
        } else {
          this.props.enqueueSnackbar('Falló en comenzar el examen', {
            variant: 'error'
          })
        }
      })
      .catch(err => console.log(err))
  }

  finishExamHandler = index => {
    this.props.enqueueSnackbar('Terminando exam', { variant: 'info' })
    const url = `${process.env.API_HOST}/exams/${this.state.exams[
      index
    ].id.toString()}/finish`

    // then hit the API
    fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + store.get('accessToken')
      }
    })
      .then(res => {
        if (res.status === 204) {
          this.props.enqueueSnackbar('Examen terminado', {
            variant: 'success'
          })

          // Change the state in that item
          this.state.exams[index].state = 'FINISHED'
          this.setState({ exams: this.state.exams })
        } else if (res.status === 422) {
          this.props.enqueueSnackbar('El examen debería estar en IN_PROGRESS', {
            variant: 'warning'
          })
        } else {
          this.props.enqueueSnackbar('Falló en terminar el examen', {
            variant: 'error'
          })
        }
      })
      .catch(err => console.log(err))
  }

  createExam = () => {
    Router.push(`/create_exam`)
  }

  seeSubmissions = index => {
    const examID = this.state.exams[index].id.toString()

    Router.push({
      pathname: `/submissions_dashboard`,
      query: {
        examID: examID
      }
    })
  }

  openDeleteModal = index => {
    this.setState({
      visibleDelete: true,
      index: index
    })
  }

  closeDeleteModal() {
    this.setState({
      visibleDelete: false,
      index: ''
    })
  }

  openStartModal = index => {
    this.setState({
      visibleStart: true,
      index: index
    })
  }

  closeStartModal() {
    this.setState({
      visibleStart: false,
      index: ''
    })
  }
  openStopModal = index => {
    this.setState({
      visibleStop: true,
      index: index
    })
  }

  closeStopModal() {
    this.setState({
      visibleStop: false,
      index: ''
    })
  }

  render() {
    const { classes } = this.props
    if (!this.state.isLoaded) {
      return <div>Loading...</div>
    } else if (this.state.exams < 1) {
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
            No tiene exámenes creados aún 🤷‍♂️
          </Typography>
          <Grid container spacing={24} alignItems="center">
            <Grid item xs={6}>
              <Button
                style={{ margin: 20 }}
                variant="contained"
                color="primary"
                onClick={this.createExam}
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
          <Typography variant="h6" style={{ margin: 20 }} gutterBottom>
            Todos sus exámenes 📚
          </Typography>
          <Grid container spacing={24} alignItems="center">
            <Grid item xs={6}>
              <Button
                style={{ margin: 20 }}
                variant="contained"
                color="primary"
                onClick={this.createExam}
              >
                Crear examen
              </Button>
            </Grid>
          </Grid>
          <Paper className={classes.root}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell align="center" style={{ maxWidth: '2px' }}>
                    Exam ID
                  </TableCell>
                  <TableCell align="center">Titulo</TableCell>
                  <TableCell align="center">Fecha y hora de comienzo</TableCell>
                  <TableCell align="center">Duración Estimada</TableCell>
                  <TableCell align="center">Estado</TableCell>
                  <TableCell align="center">Momento real de comienzo</TableCell>
                  <TableCell align="center">Duración</TableCell>
                  <TableCell align="center">Comandos</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.exams.map((exam, index) => (
                  <ExamRow
                    key={index}
                    id={exam.id}
                    description={exam.description}
                    startingAt={exam.startingAt}
                    duration={exam.duration}
                    state={exam.state}
                    actualStartingMoment={exam.actualStartingMoment}
                    actualDuration={exam.actualDuration}
                    deleteEvent={this.openDeleteModal.bind(this, index)}
                    startExam={this.openStartModal.bind(this, index)}
                    seeSubmissions={this.seeSubmissions.bind(this, index)}
                    finishExam={this.openStopModal.bind(this, index)}
                  />
                ))}
              </TableBody>

              {/* DELETE MODAL */}
              <Modal
                visible={this.state.visibleDelete}
                width="400"
                height="200"
                effect="fadeInUp"
                onClickAway={() => this.closeDeleteModal()}
              >
                <Typography
                  variant="h5"
                  style={{ margin: '20px 0px 0px 20px' }}
                  gutterBottom
                >
                  Borrar examen
                </Typography>
                <Typography
                  variant="body1"
                  style={{ margin: '20px' }}
                  gutterBottom
                >
                  Está seguro de borrar este examen? Click SI para borrarlo,
                  click fuera del recuadro para salir.
                </Typography>
                <Button
                  style={{ marginLeft: '20px' }}
                  variant="outlined"
                  color="secondary"
                  onClick={() => {
                    this.deleteExam(this.state.index)
                    this.closeDeleteModal()
                  }}
                >
                  Si, borrarlo
                </Button>
              </Modal>

              {/* START MODAL */}
              <Modal
                visible={this.state.visibleStart}
                width="400"
                height="200"
                effect="fadeInUp"
                onClickAway={() => this.closeStartModal()}
              >
                <Typography
                  variant="h5"
                  style={{ margin: '20px 0px 0px 20px' }}
                  gutterBottom
                >
                  Comenzar examen
                </Typography>
                <Typography
                  variant="body1"
                  style={{ margin: '20px' }}
                  gutterBottom
                >
                  Está seguro de comenzar este examen? Click SI para comenzarlo,
                  click fuera del recuadro para salir.
                </Typography>
                <Button
                  style={{ marginLeft: '20px' }}
                  variant="outlined"
                  color="secondary"
                  onClick={() => {
                    this.startExamHandler(this.state.index)
                    this.closeStartModal()
                  }}
                >
                  Si, comenzar examen
                </Button>
              </Modal>

              {/* STOP MODAL */}
              <Modal
                visible={this.state.visibleStop}
                width="400"
                height="200"
                effect="fadeInUp"
                onClickAway={() => this.closeStopModal()}
              >
                <Typography
                  variant="h5"
                  style={{ margin: '20px 0px 0px 20px' }}
                  gutterBottom
                >
                  Terminar examen
                </Typography>
                <Typography
                  variant="body1"
                  style={{ margin: '20px' }}
                  gutterBottom
                >
                  Está seguro de finalizar este examen? Click SI para
                  finalizarlo, click fuera del recuadro para salir.
                </Typography>
                <Button
                  style={{ marginLeft: '20px' }}
                  variant="outlined"
                  color="secondary"
                  onClick={() => {
                    this.finishExamHandler(this.state.index)
                    this.closeStopModal()
                  }}
                >
                  Si, finalizar examen
                </Button>
              </Modal>
            </Table>
          </Paper>
        </div>
      )
    }
  }
}

TeacherDashboard.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withSnackbar(withStyles(styles)(TeacherDashboard))
