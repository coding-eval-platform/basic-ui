import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { withSnackbar } from 'notistack'

import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'

import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import Button from '@material-ui/core/Button'
import Router from 'next/router'

import store from 'store'

import { handleAccessToken } from '../../auth'

const styles = theme => ({
  root: {
    flexGrow: 1,
    background: '#202020'
  },
  input: {
    color: 'white'
  },
  formControl: {
    margin: theme.spacing.unit,
    width: '100%',
    align: 'center'
  },
  button: {
    margin: theme.spacing.unit
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  }
})

class CreateTestCase extends React.Component {
  state = {
    exerciseID: '',
    exerciseQuestion: '',
    visibility: '',
    timeout: '',
    programArguments: '',
    expectedOutputs: ''
  }

  componentWillUnmount = () => {
    clearInterval(this.interval)
  }

  onVisibilityChange = visibility => {
    this.setState({ visibility: visibility.target.value })
  }

  onTimeoutChange = timeout => {
    this.setState({ timeout: timeout.target.value })
  }

  onInputsChange = programArguments => {
    this.setState({ programArguments: programArguments.target.value })
  }

  onExpectedOutputsChange = expectedOutputs => {
    this.setState({ expectedOutputs: expectedOutputs.target.value })
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

    this.setState({
      exerciseID: exerciseID,
      exerciseQuestion: exerciseQuestion
    })
  }

  createTestCase = () => {
    const programArgumentsArray = this.state.programArguments
      .split(',')
      .map(str => str.replace(/\s/g, ''))

    const expectedOutputsArray = this.state.expectedOutputs
      .split(',')
      .map(str => str.replace(/\s/g, ''))

    const url = `${process.env.API_HOST}/exercises/${this.state.exerciseID}/test-cases`

    console.log(
      'bobdy',
      JSON.stringify({
        visibility: this.state.visibility,
        timeout: this.state.timeout,
        programArguments: programArgumentsArray,
        expectedOutputs: expectedOutputsArray
      })
    )

    this.props.enqueueSnackbar('Creating test case', { variant: 'info' })
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + store.get('accessToken')
      },
      body: JSON.stringify({
        visibility: this.state.visibility,
        timeout: this.state.timeout,
        programArguments: programArgumentsArray,
        expectedOutputs: expectedOutputsArray
      })
    })
      .then(res => {
        console.log('Response status is: ', res.status)
        if (res.status === 201) {
          this.props.enqueueSnackbar('Test case creado.', {
            variant: 'success'
          })
          // Router.push(
          //   `/exercise_dashboard?exerciseID=${this.state.exerciseID}&exerciseQuestion=${this.state.exerciseQuestion}`
          // )
        } else if (res.status === 422) {
          this.props.enqueueSnackbar(
            'El examen debería estar en estado UPCOMING',
            {
              variant: 'warning'
            }
          )
        } else {
          this.props.enqueueSnackbar('Falló en crear un test case.', {
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
        <Typography style={{ margin: 20 }} variant="h5" gutterBottom>
          Crear un test case para el ejercicio: {this.state.exerciseQuestion}
        </Typography>
        <Grid container spacing={24} alignItems="center">
          <Grid item xs={3}>
            <TextField
              id="outlined-name"
              label="Timeout (ms)"
              placeholder="Ejemplo: 600"
              style={{ margin: 20 }}
              onChange={this.onTimeoutChange}
              value={this.state.timeout}
              fullWidth
              margin="normal"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={3} style={{ margin: 20 }}>
            <FormControl>
              <InputLabel>Visibilidad</InputLabel>
              <Select
                value={this.state.visibility}
                onChange={this.onVisibilityChange}
                style={{ minWidth: '10em' }}
              >
                <MenuItem value={'PUBLIC'}>Publico</MenuItem>
                <MenuItem value={'PRIVATE'}>Privado</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Grid container spacing={24} alignItems="center">
          <Grid item xs={6}>
            <TextField
              id="outlined-name"
              label="Inputs"
              placeholder="input1, input2, input3"
              style={{ margin: 20 }}
              onChange={this.onInputsChange}
              value={this.state.programArguments}
              fullWidth
              margin="normal"
              variant="outlined"
            />
          </Grid>
        </Grid>

        <Grid container spacing={24} alignItems="center">
          <Grid item xs={6}>
            <TextField
              id="outlined-name"
              label="Outputs"
              placeholder="output1, output2, output3"
              style={{ margin: 20 }}
              onChange={this.onExpectedOutputsChange}
              value={this.state.expectedOutputs}
              fullWidth
              margin="normal"
              variant="outlined"
            />
          </Grid>
        </Grid>

        <Grid container spacing={24} alignItems="center">
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
      </div>
    )
  }
}

CreateTestCase.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withSnackbar(withStyles(styles)(CreateTestCase))
