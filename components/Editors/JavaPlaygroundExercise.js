import React, { Component } from 'react'
import dynamic from 'next/dynamic'
const JavaEditor = dynamic(import('./JavaEditor'), { ssr: false })

import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import SendIcon from '@material-ui/icons/Send'
import ClearIcon from '@material-ui/icons/Clear'
import { withStyles } from '@material-ui/core/styles'

import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'

import Typography from '@material-ui/core/Typography'

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
  }
})

class JavaPlaygroundExercise extends Component {
  state = {
    output: {},
    pending: false,
    stdin: '',
    compilerFlags: '',
    code:
      'import java.util.Arrays;\npublic class Main {\n    public static void main(String... args) throws InterruptedException {\n        Arrays.stream(args).forEach(System.out::println);\n Thread.sleep(2000L);\n    }\n}\n',
    timeout: '',
    language: 'JAVA',
    programArguments: ''
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

  onCompilerFlagsChange = compilerFlags => {
    this.setState({ compilerFlags: compilerFlags.target.value })
  }

  clearAllFields = () => {
    this.setState({
      output: {},
      programArguments: '',
      stdin: '',
      compilerFlags: '',
      timeout: ''
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
          {/* INPUTS */}
          <Grid item xs={3}>
            <TextField
              id="outlined-full-width"
              label="Insert Program Arguments"
              style={{ margin: 8 }}
              rows="19"
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

            <TextField
              id="outlined-full-width"
              label="Insert Program Input"
              style={{ margin: 8 }}
              rows="1"
              placeholder="Any text you want"
              onChange={this.onStdinChange}
              value={this.state.stdin}
              fullWidth
              margin="normal"
              variant="outlined"
              InputLabelProps={{
                shrink: true
              }}
            />

            <TextField
              id="outlined-full-width"
              label="Insert Compile Flags"
              style={{ margin: 8 }}
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

            <TextField
              id="outlined-full-width"
              label="Insert timeout"
              style={{ margin: 8 }}
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

          {/* EXECUTES */}
          <Grid item xs={3}>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={this.sendCodeinSandBox}
            >
              Execute code inside editor
              <SendIcon className={classes.rightIcon} />
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              className={classes.button}
              onClick={this.clearAllFields}
            >
              Clear all fields and logs
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
              ) : (
                <Grid item xs={12} sm={12}>
                  <Typography variant="h6" gutterBottom>
                    Exit code: {this.state.output.exitCode}
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    Execution result: {this.state.output.result}
                  </Typography>
                </Grid>
              )}

              <Grid item xs={12} sm={12}>
                <Typography variant="h6" gutterBottom>
                  Output of the Java editor
                </Typography>
                <TextField
                  id="outlined-full-width"
                  // label="Output of the Ruby editor"
                  style={{ margin: 0 }}
                  multiline
                  rows="17"
                  placeholder="You will see the output of the editor here..."
                  //helperText="Full width!"
                  value={
                    stdout ||
                    (pending ? '👩🏻‍🚀 bringing your output from Mars...' : '')
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
                  Error logs
                </Typography>
                <TextField
                  id="outlined-full-width"
                  style={{ margin: 0 }}
                  multiline
                  rows="17"
                  value={
                    stderr ||
                    (pending
                      ? "Loading...\nIf there's stderr, it will be shown here"
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

JavaPlaygroundExercise.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(JavaPlaygroundExercise)
