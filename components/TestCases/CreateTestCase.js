import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'

import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import Button from '@material-ui/core/Button'
import Router from 'next/router'

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
    inputs: '',
    expectedOutputs: ''
  }

  onVisibilityChange = visibility => {
    this.setState({ visibility: visibility.target.value })
  }

  onTimeoutChange = timeout => {
    this.setState({ timeout: timeout.target.value })
  }

  onInputsChange = inputs => {
    this.setState({ inputs: inputs.target.value })
  }

  onExpectedOutputsChange = expectedOutputs => {
    this.setState({ expectedOutputs: expectedOutputs.target.value })
  }

  componentDidMount = () => {
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
    const inputsArray = this.state.inputs
      .split(',')
      .map(str => str.replace(/\s/g, ''))

    const expectedOutputsArray = this.state.expectedOutputs
      .split(',')
      .map(str => str.replace(/\s/g, ''))

    console.log(
      'The created test case is: ',
      JSON.stringify({
        visibility: this.state.visibility,
        timeout: this.state.timeout,
        inputs: inputsArray,
        expectedOutputs: expectedOutputsArray
      })
    )

    console.log('EL EX ID ES: ', this.state.exerciseID)

    const url = `${process.env.API_HOST}/exercises/${this.state.exerciseID}/test-cases`
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        visibility: this.state.visibility,
        timeout: this.state.timeout,
        inputs: inputsArray,
        expectedOutputs: expectedOutputsArray
      })
    })
      .then(res => {
        Router.push(`/teacher_dashboard`)
      })
      .catch(err => console.log(err))
  }

  render() {
    const { classes } = this.props

    return (
      <div>
        <Typography style={{ margin: 20 }} variant="h5" gutterBottom>
          Create a test case for the exercise: {this.state.exerciseQuestion}
        </Typography>
        <Grid container spacing={24} alignItems="center">
          <Grid item xs={3}>
            <TextField
              id="outlined-name"
              label="Timeout in ms"
              placeholder="Example: 600"
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
              <InputLabel>Visibility</InputLabel>
              <Select
                value={this.state.visibility}
                onChange={this.onVisibilityChange}
                style={{ minWidth: '10em' }}
                // PONER DEFAULT VALUES!
              >
                <MenuItem value={'PUBLIC'}>Public</MenuItem>
                <MenuItem value={'PRIVATE'}>Private</MenuItem>
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
              value={this.state.inputs}
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
              onClick={this.createTestCase}
            >
              Create test case
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

export default withStyles(styles)(CreateTestCase)
