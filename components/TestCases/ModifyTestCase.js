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

class ModifyTestCase extends React.Component {
  state = {
    exerciseID: '',
    exerciseQuestion: '',
    testCaseID: '',
    exerciseQuestion: '',
    visibility: '',
    timeout: '',
    programArguments: '',
    expectedOutputs: ''
  }

  componentDidMount = () => {
    const exerciseID = new URL(window.location.href).searchParams.get(
      'exerciseID'
    )
    const testCaseID = new URL(window.location.href).searchParams.get(
      'testCaseID'
    )
    const exerciseQuestion = new URL(window.location.href).searchParams.get(
      'exerciseQuestion'
    )

    const url = `${process.env.API_HOST}/test-cases/${testCaseID}`

    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + store.get('accessToken')
      }
    })
      .then(async res => {
        const testCaseJSONResponse = await res.json()
        console.log('testCaseJSONResponse', testCaseJSONResponse)

        this.setState({
          exerciseID: exerciseID,
          exerciseQuestion: exerciseQuestion,
          testCaseID: testCaseID,
          visibility: testCaseJSONResponse.visibility,
          timeout: testCaseJSONResponse.timeout,
          programArguments: testCaseJSONResponse.programArguments,
          expectedOutputs: testCaseJSONResponse.expectedOutputs
        })
      })
      .catch(err => console.log(err))
  }

  componentWillMount = async () => {
    const accessToken = await handleAccessToken()
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

  modifyTestCase = () => {
    const programArgumentsArray =
      this.state.programArguments === []
        ? []
        : this.state.programArguments
            .split(',')
            .map(str => str.replace(/\s/g, ''))

    const expectedOutputsArray =
      this.state.expectedOutputs === []
        ? []
        : this.state.expectedOutputs
            .split(',')
            .map(str => str.replace(/\s/g, ''))

    const url = `${process.env.API_HOST}/test-cases/${this.state.testCaseID}`
    this.props.enqueueSnackbar('Modificando test case', { variant: 'info' })

    fetch(url, {
      method: 'PUT',
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
        if (res.status === 204) {
          this.props.enqueueSnackbar('Test case modificado.', {
            variant: 'success'
          })
          // Router.push(`/teacher_dashboard`)
        } else if (res.status === 422) {
          this.props.enqueueSnackbar(
            'El examen debería estar en estado UPCOMING',
            {
              variant: 'warning'
            }
          )
        } else {
          this.props.enqueueSnackbar('Falló en modificar test case.', {
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
          Modificar un test case para el ejercicio:{' '}
          {this.state.exerciseQuestion}
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

        {/* <Grid container spacing={24} alignItems="center"> */}
        {/* </Grid> */}
        <Grid container spacing={24} alignItems="center">
          <Grid item xs={6}>
            <Button
              style={{ margin: 20 }}
              variant="contained"
              color="primary"
              onClick={this.modifyTestCase}
            >
              Modificar test case
            </Button>
          </Grid>
        </Grid>
      </div>
    )
  }
}

ModifyTestCase.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withSnackbar(withStyles(styles)(ModifyTestCase))
