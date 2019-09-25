import React, { Component } from 'react'
import dynamic from 'next/dynamic'
const RubyEditor = dynamic(import('./RubyEditor'), { ssr: false })

import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import SendIcon from '@material-ui/icons/Send'
import { withStyles } from '@material-ui/core/styles'

import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

const styles = theme => ({
  root: {
    background: '#202020'
  },
  input: {
    color: 'white'
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
  }
})

class RubyPlaygroundExercise extends Component {
  state = {
    output: {},
    pending: false,
    stdin: [],
    code: 'ARGV.each do |a|\n\tputs a\nend\n',
    timeout: 1000,
    language: 'RUBY',
    programArguments: ''
  }

  sendCodeinSandBox = () => {
    this.setState({ output: {} })
    this.setState({ pending: true })

    const final_input = this.state.programArguments
      .split(',')
      .map(str => str.replace(/\s/g, ''))

    fetch(`${process.env.API_HOST}/execution-requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        stdin: this.state.stdin,
        code: this.state.code,
        timeout: this.state.timeout,
        language: this.state.language,
        programArguments: final_input
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
      console.log('object', result_id)
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

  render() {
    const { classes } = this.props
    let pending = this.state.pending

    // VER ESTO
    const output =
      this.state.output.result === 'UNKNOWN_ERROR'
        ? 'COMPILATION ERROR'
        : (this.state.output.stdout || []).reduce(
            (memo, line) => memo + line + '\n',
            ''
          )

    // VER ESTO
    // const stderr =
    //   this.state.output.result === "TIMEOUT"
    //     ? "The compilation phase failed (i.e the code could not be compiled)."
    //     : "";

    return (
      <div>
        {/* <Typography variant="h4" gutterBottom>
          Ruby programming language playground
        </Typography> */}
        <Grid container spacing={24} alignItems="center">
          {/* INPUTS */}
          <Grid item xs={3}>
            <TextField
              id="outlined-full-width"
              label="Insert Program Arguments"
              style={{ margin: 8 }}
              rows="19"
              placeholder="input1, input2, input3"
              onChange={this.onProgramArgumentsChange}
              value={this.state.programArguments}
              fullWidth
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
          </Grid>

          {/* EXECUTE */}
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
          </Grid>
        </Grid>

        <Grid container spacing={24}>
          {/* RUBY EDITOR */}
          <Grid item xs={12} sm={6}>
            <RubyEditor
              codeToRun={this.state.code}
              onChange={this.onCodeChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Grid container spacing={24}>
              {console.log(this.state.output.result)}
              {this.state.output.result === undefined ? (
                ''
              ) : (
                <Grid item xs={12} sm={12}>
                  <Typography variant="body1" gutterBottom>
                    Exit code: {this.state.output.exitCode}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Execution result: {this.state.output.result}
                  </Typography>
                </Grid>
              )}

              <Grid item xs={12} sm={12}>
                <Typography variant="h6" gutterBottom>
                  Output of the Ruby editor
                </Typography>
                <TextField
                  id="outlined-full-width"
                  // label="Output of the Ruby editor"
                  style={{ margin: 0 }}
                  multiline
                  rows="17"
                  placeholder="You will see the output of the editor here..."
                  // helperText="Full width!"
                  value={
                    output ||
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
                    output ||
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
            </Grid>
          </Grid>
        </Grid>
      </div>
    )
  }
}

RubyPlaygroundExercise.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(RubyPlaygroundExercise)
