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

import TestCaseRow from './TestCaseRow.js'
import { handleAccessToken } from '../../../auth'
import { withSnackbar } from 'notistack'
import store from 'store'
import Modal from 'react-awesome-modal'

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto'
  }
})

class ExerciseDashboard extends React.Component {
  state = {
    exerciseID: '',
    exerciseQuestion: '',
    publicTestCases: [],
    privateTestCases: [],
    publicIsLoaded: false,
    privateIsLoaded: false,
    visiblePrivateDelete: false,
    visiblePublicDelete: false,
    index: ''
  }

  componentWillUnmount = () => {
    clearInterval(this.interval)
  }

  componentDidMount = () => {
    this.interval = setInterval(() => {
      handleAccessToken()
    }, 15 * 1000)

    const exerciseID = new URL(window.location.href).searchParams.get(
      'exerciseID'
    )
    const exerciseQuestion = new URL(window.location.href).searchParams.get(
      'exerciseQuestion'
    )
    const publicURL = `${
      process.env.API_HOST
    }/exercises/${exerciseID.toString()}/test-cases/public`
    const privateURL = `${
      process.env.API_HOST
    }/exercises/${exerciseID.toString()}/test-cases/private`

    this.setState({
      exerciseID: exerciseID,
      exerciseQuestion: exerciseQuestion
    })

    // PUBLIC TEST CASES
    fetch(publicURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + store.get('accessToken')
      }
    })
      .then(async res => {
        const outputJSONResponsePublicTestCases = await res.json()

        this.setState({
          publicIsLoaded: true,
          publicTestCases: outputJSONResponsePublicTestCases
        })
      })
      .catch(err => console.log(err))

    // PRIVATE TEST CASES
    fetch(privateURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + store.get('accessToken')
      }
    })
      .then(async res => {
        const outputJSONResponsePrivateTestCases = await res.json()

        this.setState({
          privateIsLoaded: true,
          privateTestCases: outputJSONResponsePrivateTestCases
        })
      })
      .catch(err => console.log(err))
  }

  createTestCase = () => {
    Router.push({
      pathname: `/create_testcase`,
      query: {
        exerciseID: `${this.state.exerciseID}`,
        exerciseQuestion: `${this.state.exerciseQuestion}`
      }
    })
  }

  openDeletePrivateModal = index => {
    this.setState({
      visiblePrivateDelete: true,
      index: index
    })
  }

  closeDeletePrivateModal() {
    this.setState({
      visiblePrivateDelete: false,
      index: ''
    })
  }

  openDeletePublicModal = index => {
    this.setState({
      visiblePublicDelete: true,
      index: index
    })
  }

  closeDeletePublicModal() {
    this.setState({
      visiblePublicDelete: false,
      index: ''
    })
  }

  deletePublicTestCases = index => {
    this.props.enqueueSnackbar('Borrando test case', { variant: 'info' })
    const url = `${
      process.env.API_HOST
    }/test-cases/${this.state.publicTestCases[index].id.toString()}`

    fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + store.get('accessToken')
      }
    })
      .then(res => {
        if (res.status === 204) {
          this.props.enqueueSnackbar('Test case borrado', {
            variant: 'success'
          })
          // Removes the desired item.
          this.state.publicTestCases.splice(index, 1)
          this.setState({ publicTestCases: this.state.publicTestCases })
        } else if (res.status === 422) {
          this.props.enqueueSnackbar(
            'El examen debería estar en estado UPCOMING',
            {
              variant: 'warning'
            }
          )
        } else {
          this.props.enqueueSnackbar('Falló al borrar test case', {
            variant: 'error'
          })
        }
      })
      .catch(err => console.log(err))
  }

  deletePrivateTestCases = index => {
    this.props.enqueueSnackbar('Borrando test case', { variant: 'info' })
    const url = `${
      process.env.API_HOST
    }/test-cases/${this.state.privateTestCases[index].id.toString()}`

    fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + store.get('accessToken')
      }
    })
      .then(res => {
        if (res.status === 204) {
          this.props.enqueueSnackbar('Test case borrado', {
            variant: 'success'
          })
          // Removes the desired item.
          this.state.privateTestCases.splice(index, 1)
          this.setState({ privateTestCases: this.state.privateTestCases })
        } else if (res.status === 422) {
          this.props.enqueueSnackbar(
            'El examen debería estar en estado UPCOMING',
            {
              variant: 'warning'
            }
          )
        } else {
          this.props.enqueueSnackbar('Falló al borrar test case', {
            variant: 'error'
          })
        }
      })
      .catch(err => console.log(err))
  }

  render() {
    const { classes } = this.props
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
          Todos sus test cases para el ejercicio: {this.state.exerciseQuestion}
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={6}>
            <Button
              style={{ margin: 20 }}
              variant="contained"
              color="primary"
              onClick={this.createTestCase}
            >
              Crear test case
            </Button>
          </Grid>
        </Grid>
        {!this.state.publicIsLoaded ? (
          <div>Cargando...</div>
        ) : this.state.publicTestCases < 1 ? (
          <div>
            <Typography variant="h6" style={{ margin: 20 }} gutterBottom>
              No tiene test cases públicos creados aún 🤷‍♂️
            </Typography>
            {/* <Grid container spacing={2} alignItems="center">
              <Grid item xs={6}>
                <Button
                  style={{ margin: 20 }}
                  variant="contained"
                  color="primary"
                  onClick={this.createTestCase}
                >
                  Create one!
                </Button>
              </Grid>
            </Grid> */}
          </div>
        ) : (
          <div>
            <Typography variant="h6" style={{ margin: 20 }} gutterBottom>
              Test cases publicos
            </Typography>
            <Paper className={classes.root}>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell align="center" style={{ maxWidth: '2px' }}>
                      Test Case ID
                    </TableCell>
                    <TableCell align="center">Visibilidad</TableCell>
                    <TableCell align="center">Timeout (ms)</TableCell>
                    <TableCell align="center">Comandos</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.publicTestCases.map((testCase, index) => (
                    <TestCaseRow
                      key={index}
                      testCaseID={testCase.id}
                      exerciseID={this.state.exerciseID}
                      exerciseQuestion={this.state.exerciseQuestion}
                      visibility={testCase.visibility}
                      timeout={testCase.timeout}
                      programArguments={testCase.programArguments}
                      expectedOutputs={testCase.expectedOutputs}
                      deleteEvent={this.openDeletePublicModal.bind(this, index)}
                    />
                  ))}
                </TableBody>
                {/* DELETE MODAL */}
                <Modal
                  visible={this.state.visiblePublicDelete}
                  width="400"
                  height="200"
                  effect="fadeInUp"
                  onClickAway={() => this.closeDeletePublicModal()}
                >
                  <Typography
                    variant="h5"
                    style={{ margin: '20px 0px 0px 20px' }}
                    gutterBottom
                  >
                    Borrar test case
                  </Typography>
                  <Typography
                    variant="body1"
                    style={{ margin: '20px' }}
                    gutterBottom
                  >
                    Está seguro de borrar este test case? Click SI para
                    borrarlo, click fuera del recuadro para salir.
                  </Typography>
                  <Button
                    style={{ marginLeft: '20px' }}
                    variant="outlined"
                    color="secondary"
                    onClick={() => {
                      this.deletePublicTestCases(this.state.index)
                      this.closeDeletePublicModal()
                    }}
                  >
                    Si, borrarlo
                  </Button>
                </Modal>
              </Table>
            </Paper>
          </div>
        )}

        {!this.state.privateIsLoaded ? (
          <div>Cargando...</div>
        ) : this.state.privateTestCases < 1 ? (
          <div>
            <Typography variant="h6" style={{ margin: 20 }} gutterBottom>
              No tiene test cases privados creados aún 🤷‍♂️
            </Typography>
            {/* <Grid container spacing={2} alignItems="center">
              <Grid item xs={6}>
                <Button
                  style={{ margin: 20 }}
                  variant="contained"
                  color="primary"
                  onClick={this.createTestCase}
                >
                  Create one!
                </Button>
              </Grid>
            </Grid> */}
          </div>
        ) : (
          <div>
            <Typography variant="h6" style={{ margin: 20 }} gutterBottom>
              Test cases privados
            </Typography>
            <Paper className={classes.root}>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell align="center" style={{ maxWidth: '2px' }}>
                      Test Case ID
                    </TableCell>
                    <TableCell align="center">Visibilidad</TableCell>
                    <TableCell align="center">Timeout (ms)</TableCell>
                    <TableCell align="center">Comandos</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.privateTestCases.map((testCase, index) => (
                    <TestCaseRow
                      key={index}
                      testCaseID={testCase.id}
                      exerciseID={this.state.exerciseID}
                      exerciseQuestion={this.state.exerciseQuestion}
                      visibility={testCase.visibility}
                      timeout={testCase.timeout}
                      programArguments={testCase.programArguments}
                      expectedOutputs={testCase.expectedOutputs}
                      deleteEvent={this.openDeletePrivateModal.bind(
                        this,
                        index
                      )}
                    />
                  ))}
                </TableBody>
                {/* DELETE MODAL */}
                <Modal
                  visible={this.state.visiblePrivateDelete}
                  width="400"
                  height="200"
                  effect="fadeInUp"
                  onClickAway={() => this.closeDeletePrivateModal()}
                >
                  <Typography
                    variant="h5"
                    style={{ margin: '20px 0px 0px 20px' }}
                    gutterBottom
                  >
                    Borrar test case
                  </Typography>
                  <Typography
                    variant="body1"
                    style={{ margin: '20px' }}
                    gutterBottom
                  >
                    Está seguro de borrar este test case? Click SI para
                    borrarlo, click fuera del recuadro para salir.
                  </Typography>
                  <Button
                    style={{ marginLeft: '20px' }}
                    variant="outlined"
                    color="secondary"
                    onClick={() => {
                      this.deletePrivateTestCases(this.state.index)
                      this.closeDeletePrivateModal()
                    }}
                  >
                    Si, borrarlo
                  </Button>
                </Modal>
              </Table>
            </Paper>
          </div>
        )}
      </div>
    )
  }
}

ExerciseDashboard.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withSnackbar(withStyles(styles)(ExerciseDashboard))
