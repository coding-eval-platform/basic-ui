import React, { Component } from 'react'
import dynamic from 'next/dynamic'
const JavaEditor = dynamic(import('./JavaEditor'), { ssr: false })

import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import SendIcon from '@material-ui/icons/Send'
import ClearIcon from '@material-ui/icons/Clear'
import InfoIcon from '@material-ui/icons/Info'
import DoneIcon from '@material-ui/icons/Done'
import NotesIcon from '@material-ui/icons/Notes'
import Tooltip from '@material-ui/core/Tooltip'
import { withStyles } from '@material-ui/core/styles'
import { withSnackbar } from 'notistack'

import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import store from 'store'

import Typography from '@material-ui/core/Typography'

import Dialog from '@material-ui/core/Dialog'
import ListItemText from '@material-ui/core/ListItemText'
import ListItem from '@material-ui/core/ListItem'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Slide from '@material-ui/core/Slide'

import { handleAccessToken } from '../../auth'

const styles = theme => ({
  root: {
    background: '#202020'
  },
  input: {
    color: 'white',
    fontFamily: 'Monospace',
    fontSize: 15
  },
  button: {
    margin: theme.spacing.unit
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  },
  infoIcon: {
    color: '#ff9800'
    // marginRight: theme.spacing.unit
  },
  iconSmall: {
    fontSize: 20
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  multilineColor: {
    color: 'red',
    fontFamily: 'Monospace',
    fontSize: 15
  },
  responseStylesOk: {
    background: '#3f51b5',
    color: 'white'
  },
  responseStylesNotOk: {
    background: '#f44336',
    color: 'white'
  },
  appBar: {
    position: 'relative'
  },
  flex: {
    flex: 1
  }
})

function Transition(props) {
  return <Slide direction="up" {...props} />
}

class JavaExamExercise extends Component {
  state = {
    output: {},
    pending: false,
    testCases: [],
    testCaseBeingRun: '',
    open: false,
    stdin: '',
    compilerFlags: '',
    code: this.props.solutionTemplate,
    timeout: '',
    language: 'JAVA',
    programArguments: '',
    mainFileName: ''
  }

  componentDidMount = () => {
    this.interval = setInterval(() => {
      handleAccessToken()
    }, 15 * 1000)
  }

  componentWillUnmount = () => {
    clearInterval(this.interval)
  }

  handleClickOpen = () => {
    this.setState({ open: true })
  }

  handleClose = () => {
    this.setState({ open: false })
  }

  viewTestCases = exerciseID => {
    console.log('Exercise ID is: ', exerciseID)
    this.handleClickOpen()

    this.props.enqueueSnackbar('Buscando test cases públicos.', {
      variant: 'info'
    })

    fetch(`${process.env.API_HOST}/exercises/${exerciseID}/test-cases/public`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + store.get('accessToken')
      }
    })
      .then(async res => {
        console.log('Response status is: ', res.status)
        if (res.status === 200) {
          this.props.enqueueSnackbar('Test cases públicos encontrados.', {
            variant: 'success'
          })
          const testCases = await res.json()
          console.log('test cases are: ', testCases)

          this.setState({
            testCases: testCases
          })
        } else {
          this.props.enqueueSnackbar(
            'Falló en buscar los test cases públicos.',
            {
              variant: 'error'
            }
          )
        }
      })
      .catch(err => console.log(err))
  }

  modifySolution = solutionID => {
    console.log('Solution ID is: ', solutionID)

    this.props.enqueueSnackbar('Modificando solución.', {
      variant: 'info'
    })

    fetch(`${process.env.API_HOST}/solutions/${solutionID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + store.get('accessToken')
      },
      body: JSON.stringify({
        answer: this.state.code
      })
    })
      .then(res => {
        console.log('Response status is: ', res.status)
        if (res.status === 204) {
          this.props.enqueueSnackbar('Solución modificada.', {
            variant: 'success'
          })
        } else if (res.status === 422) {
          this.props.enqueueSnackbar('Ya se entregó el examen.', {
            variant: 'warning'
          })
        } else {
          this.props.enqueueSnackbar('Falló en crear el ejercicio.', {
            variant: 'error'
          })
        }
      })
      .catch(err => console.log(err))
  }

  runPublicTestCase = (timeout, programArguments, stdin, testCaseBeingRun) => {
    console.log('runPublicTestCase params: ', timeout, programArguments, stdin)

    this.setState({
      output: {},
      pending: true,
      testCaseBeingRun: testCaseBeingRun
      // open: false
    })

    fetch(`${process.env.API_HOST}/execution-requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        stdin: stdin,
        code: this.state.code,
        timeout: timeout,
        language: this.state.language,
        programArguments: programArguments,
        compilerFlags: this.state.compilerFlags
      })
    })
      .then(res => {
        let result_id = res.headers.get('Location').split('/')
        result_id = result_id[result_id.length - 1]
        this.polling(result_id)
      })
      .catch(err => console.log(err))
  }

  sendCodeinSandBox = () => {
    this.setState({ output: {} })
    this.setState({ pending: true })

    const final_programArguments = this.state.programArguments
      .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
      .map(str => str.replace(/"/g, ''))

    const final_stdin = this.state.stdin
      .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
      .map(str => str.replace(/"/g, ''))

    fetch(`${process.env.API_HOST}/execution-requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        stdin: final_stdin,
        code: this.state.code,
        timeout: this.state.timeout,
        language: this.state.language,
        programArguments: final_programArguments,
        compilerFlags: this.state.compilerFlags,
        mainFileName: this.state.mainFileName
      })
    })
      .then(res => {
        let result_id = res.headers.get('Location').split('/')
        result_id = result_id[result_id.length - 1]
        this.polling(result_id)
      })
      .catch(err => console.log(err))
  }

  polling = result_id => {
    this.IntervalPolling = setInterval(() => {
      let url = `${process.env.API_HOST}/execution-requests/${result_id}/response/`

      fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
        .then(async res => {
          const outputJSONResponse = await res.json()
          console.log('json: ', outputJSONResponse)
          if (
            outputJSONResponse &&
            (outputJSONResponse.result === 'COMPLETED' ||
              outputJSONResponse.result === 'TIMEOUT' ||
              outputJSONResponse.result === 'COMPILE_ERROR' ||
              outputJSONResponse.result === 'INITIALIZATION_ERROR' ||
              outputJSONResponse.result === 'UNKNOWN_ERROR')
          ) {
            console.log(
              'Finished polling, state is: ',
              outputJSONResponse.result
            )
            this.setState({ output: outputJSONResponse })
            this.setState({ pending: false })
            clearInterval(this.IntervalPolling)
          }
        })
        .catch(err => console.log(err))
    }, 3000)
  }

  onCodeChange = code => this.setState({ code })

  onProgramArgumentsChange = programArguments => {
    this.setState({ programArguments: programArguments.target.value })
  }

  onStdinChange = stdin => {
    this.setState({ stdin: stdin.target.value })
  }

  onTimemoutChange = timeout => {
    this.setState({ timeout: timeout.target.value })
  }

  onMainFileNameChange = mainFileName => {
    this.setState({ mainFileName: mainFileName.target.value })
  }

  onCompilerFlagsChange = compilerFlags => {
    this.setState({ compilerFlags: compilerFlags.target.value })
  }

  clearAllFields = () => {
    this.setState({
      output: {},
      programArguments: '',
      stdin: '',
      timeout: '',
      compilerFlags: '',
      mainFileName: ''
    })
  }

  render() {
    const { classes } = this.props
    let pending = this.state.pending

    const stdout = (this.state.output.stdout || []).reduce(
      (memo, line) => memo + line + '\n',
      ''
    )

    const stderr = (this.state.output.stderr || []).reduce(
      (memo, line) => memo + line + '\n',
      ''
    )

    return (
      <div>
        <Grid container spacing={24} alignItems="center">
          <Grid item xs={9}>
            <Typography style={{ margin: 20 }} variant="body1" gutterBottom>
              {this.props.question}
            </Typography>
            <Typography style={{ margin: 20 }} variant="subtitle1" gutterBottom>
              El puntaje es de: {this.props.awardedScore} puntos
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={this.modifySolution.bind(this, this.props.solutionID.id)}
            >
              Entregar ejercicio
              <DoneIcon className={classes.rightIcon} />
            </Button>
            <Button
              variant="outlined"
              color="primary"
              className={classes.button}
              onClick={this.viewTestCases.bind(this, this.props.exerciseID)}
            >
              Ver test cases
              <NotesIcon className={classes.rightIcon} />
            </Button>
          </Grid>
        </Grid>
        <Dialog
          fullScreen
          open={this.state.open}
          onClose={this.handleClose}
          TransitionComponent={Transition}
        >
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton
                color="inherit"
                onClick={this.handleClose}
                aria-label="Close"
              >
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" color="inherit" className={classes.flex}>
                Test cases públicos del ejercicio {this.props.exerciseNumber}
              </Typography>
            </Toolbar>
          </AppBar>
          <List>
            {this.state.testCases.map((testCase, index) => {
              return (
                <div key={index}>
                  <ListItem button>
                    <Grid container spacing={24} alignItems="center">
                      <ListItemText
                        style={{ margin: 20 }}
                        primary={`Test case ${index + 1}`}
                        secondary={
                          <div>
                            <Grid item xs={10}>
                              <Typography type="body2">
                                * Timeout (ms):{' '}
                                {testCase.timeout === ''
                                  ? ' - '
                                  : testCase.timeout}
                              </Typography>
                              <Typography type="body2">
                                * Argumentos del programa:{' '}
                                {testCase.programArguments === []
                                  ? ' - '
                                  : testCase.programArguments.toString()}
                              </Typography>
                              <Typography type="body2">
                                * Estandar input:{' '}
                                {testCase.stdin.toString() === ''
                                  ? ' - '
                                  : testCase.stdin.toString()}
                              </Typography>
                              <Typography type="body2">
                                * Salida esperada:{' '}
                                {testCase.expectedOutputs === []
                                  ? ' - '
                                  : testCase.expectedOutputs.toString()}
                              </Typography>
                            </Grid>
                          </div>
                        }
                      />
                    </Grid>
                    <Grid
                      container
                      spacing={24}
                      justify="flex-end"
                      alignItems="center"
                    >
                      <Grid item xs={6}>
                        <Button
                          variant="outlined"
                          color="primary"
                          className={classes.button}
                          onClick={this.runPublicTestCase.bind(
                            this,
                            testCase.timeout,
                            testCase.programArguments,
                            testCase.stdin,
                            testCase.id
                          )}
                        >
                          Correr
                          <SendIcon className={classes.rightIcon} />
                        </Button>
                      </Grid>
                    </Grid>
                    <Grid
                      container
                      spacing={24}
                      justify="flex-end"
                      alignItems="center"
                    >
                      <Grid item xs={12}>
                        <Typography type="h2">
                          {this.state.testCaseBeingRun === '' ||
                          this.state.testCaseBeingRun != testCase.id.toString()
                            ? ''
                            : !this.state.pending &&
                              Object.keys(this.state.output).length === 0 &&
                              this.state.output.constructor === Object
                            ? ''
                            : this.state.pending &&
                              Object.keys(this.state.output).length === 0 &&
                              this.state.output.constructor === Object
                            ? 'Corriendo test...'
                            : !this.state.pending &&
                              this.state.output.stdout.toString() ===
                                testCase.expectedOutputs.toString()
                            ? 'Aprobado ✅'
                            : 'Desaprobado ❌'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                  <Divider />
                </div>
              )
            })}
          </List>
        </Dialog>
        <Grid container spacing={24} alignItems="center">
          {/* INPUTS */}
          <Grid item xs={3}>
            <TextField
              id="outlined-full-width"
              label="Insertar argumentos del programa"
              style={{ margin: 8 }}
              rows="1"
              placeholder="comma+space separated, ie: input1, input2, input3"
              fullWidth
              onChange={this.onProgramArgumentsChange}
              value={this.state.programArguments}
              margin="normal"
              variant="outlined"
              InputLabelProps={{
                shrink: true
              }}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              id="outlined-full-width"
              label="Insertar input del programa"
              style={{ margin: 1 }}
              rows="1"
              placeholder="El texto deseado"
              onChange={this.onStdinChange}
              value={this.state.stdin}
              fullWidth
              margin="normal"
              variant="outlined"
              InputLabelProps={{
                shrink: true
              }}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              id="outlined-full-width"
              label="Insertar Nombre del archivo"
              style={{ margin: 1 }}
              rows="1"
              placeholder="Ejercicio1.java"
              onChange={this.onMainFileNameChange}
              value={this.state.onMainFileNameChange}
              fullWidth
              margin="normal"
              variant="outlined"
              InputLabelProps={{
                shrink: true
              }}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              id="outlined-full-width"
              label="Insertar Compile Flags"
              style={{ margin: 1 }}
              rows="1"
              placeholder="-d -g"
              onChange={this.onCompilerFlagsChange}
              value={this.state.compilerFlags}
              fullWidth
              margin="normal"
              variant="outlined"
              InputLabelProps={{
                shrink: true
              }}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              id="outlined-full-width"
              label="Insertar timeout"
              style={{ margin: 1 }}
              rows="1"
              placeholder="Example (ms): 1000"
              onChange={this.onTimemoutChange}
              value={this.state.timeout}
              fullWidth
              margin="normal"
              variant="outlined"
              InputLabelProps={{
                shrink: true
              }}
            />
          </Grid>
        </Grid>

        <Grid container spacing={24} alignItems="center" justify="flex-end">
          <Tooltip title="Se está usando el paquete default de Java">
            <InfoIcon className={classes.infoIcon}></InfoIcon>
          </Tooltip>

          <Grid item xs={3}>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={this.sendCodeinSandBox}
            >
              Correr código
              <SendIcon className={classes.rightIcon} />
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              className={classes.button}
              onClick={this.clearAllFields}
            >
              Clear
              <ClearIcon className={classes.rightIcon} />
            </Button>
          </Grid>
        </Grid>

        {/* JAVA EDITOR */}
        <Grid container spacing={24}>
          <Grid item xs={12} sm={6}>
            <JavaEditor
              codeToRun={this.state.code}
              onChange={this.onCodeChange}
            />
          </Grid>

          {/* JAVA OUTPUT */}
          <Grid item xs={12} sm={6}>
            <Grid container spacing={24}>
              {this.state.output.result === undefined ? (
                ''
              ) : this.state.output.result === 'COMPLETED' ? (
                <Grid item xs={12} sm={12}>
                  <Typography
                    className={classes.responseStylesOk}
                    variant="h6"
                    gutterBottom
                  >
                    Código de salida: {this.state.output.exitCode}
                  </Typography>
                  <Typography
                    className={classes.responseStylesOk}
                    variant="h6"
                    gutterBottom
                  >
                    Resultado: {this.state.output.result}
                  </Typography>
                </Grid>
              ) : (
                <Grid item xs={12} sm={12}>
                  <Typography
                    className={classes.responseStylesNotOk}
                    variant="h6"
                    gutterBottom
                  >
                    Código de salida: {this.state.output.exitCode}
                  </Typography>
                  <Typography
                    className={classes.responseStylesNotOk}
                    variant="h6"
                    gutterBottom
                  >
                    Resultado: {this.state.output.result}
                  </Typography>
                </Grid>
              )}

              <Grid item xs={12} sm={12}>
                <Typography variant="h6" gutterBottom>
                  Salida estándar del editor de Java
                </Typography>
                <TextField
                  id="outlined-full-width"
                  // label="Ruby editor (stdout)"
                  style={{ margin: 0 }}
                  multiline
                  rows="10"
                  placeholder="La salida estándar aparecerá aquí...."
                  //helperText="Full width!"
                  value={
                    stdout || (pending ? '👩🏻‍🚀 Buscando la respuesta...' : '')
                  }
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true
                  }}
                  className={classes.root}
                  InputProps={{
                    className: classes.input
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <Typography variant="h6" gutterBottom>
                  Log de errores (stderr)
                </Typography>
                <TextField
                  id="outlined-full-width"
                  style={{ margin: 0 }}
                  multiline
                  rows="10"
                  value={
                    stderr ||
                    (pending
                      ? 'Cargando...\nSi hay salida de errores (stderr), aparecerá aquí...'
                      : '')
                  }
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true
                  }}
                  className={classes.root}
                  InputProps={{
                    className: classes.multilineColor
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    )
  }
}

JavaExamExercise.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withSnackbar(withStyles(styles)(JavaExamExercise))
