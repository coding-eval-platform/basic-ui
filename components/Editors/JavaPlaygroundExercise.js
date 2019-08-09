import React, { Component } from 'react'
import dynamic from 'next/dynamic'
const JavaEditor = dynamic(import('./JavaEditor'), { ssr: false })

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

class JavaPlaygroundExercise extends Component {
  state = {
    output: {},
    programInput: '',
    compileFlags: '',
    pending: false,
    code:
      'import java.util.Arrays;\npublic class Main {\n    public static void main(String... args) throws InterruptedException {\n        Arrays.stream(args).forEach(System.out::println);\n Thread.sleep(2000L);\n    }\n}\n',
    timeout: 10000,
    language: 'JAVA',
    // inputs: ["Hola", "Como", "andas?", "Re bien!", "ñoño", "人物"]
    input: ''
  }

  sendCodeinSandBox = () => {
    this.setState({ output: {} })

    this.setState({ pending: true })
    const final_input = this.state.input
      .split(',')
      .map(str => str.replace(/\s/g, ''))

    fetch(`${process.env.API_HOST}/execution-requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: this.state.code,
        timeout: this.state.timeout,
        language: this.state.language,
        inputs: final_input
      })
    })
      .then(res => {
        // console.log("RESPONSE IS: ", res.headers.get("Location"));
        let result_id = res.headers.get('Location').split('/')
        result_id = result_id[result_id.length - 1]
        // console.log("RESULT_ID IS: ", result_id);

        // once the code is executed, wait for the response on the output box
        this.polling(result_id)
      })
      .catch(err => console.log(err))
  }

  polling = result_id => {
    this.IntervalPolling = setInterval(() => {
      let url = `${process.env.API_HOST}/execution-requests/result_id/result/`
      console.log('url: ', url)
      fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
        .then(async res => {
          const outputJSONResponse = await res.json()
          console.log('json: ', outputJSONResponse)
          if (
            outputJSONResponse &&
            (outputJSONResponse.type === 'FINISHED' ||
              outputJSONResponse.type === 'COMPILE_ERROR')
          ) {
            console.log('Finished polling, state is: ', outputJSONResponse.type)
            this.setState({ output: outputJSONResponse })
            this.setState({ pending: false })
            clearInterval(this.IntervalPolling)
          }
        })
        .catch(err => console.log(err))
    }, 3000)
  }

  onCodeChange = code => this.setState({ code })

  onInputChange = input => {
    this.setState({ input: input.target.value })
  }

  onProgramInputChange = programInput => {
    this.setState({ programInput: programInput.target.value })
  }

  onCompileFlagsChange = compileFlags => {
    this.setState({ compileFlags: compileFlags.target.value })
  }

  render() {
    const { classes } = this.props
    let pending = this.state.pending

    const output =
      this.state.output.type === 'COMPILE_ERROR'
        ? '️️☠️ COMPILATION ERROR  ☠️\n========================\n\n' +
          this.state.output.compilerErrors.reduce(
            (memo, line) => memo + line + '\n',
            ''
          )
        : (this.state.output.stdout || []).reduce(
            (memo, line) => memo + line + '\n',
            ''
          )

    return (
      <div>
        {/* <Typography variant="h4" gutterBottom>
          Java programming language playground
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
              fullWidth
              onChange={this.onInputChange}
              value={this.state.input}
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
              onChange={this.onProgramInputChange}
              value={this.state.programInput}
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
              onChange={this.onCompileFlagsChange}
              value={this.state.compileFlags}
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
      </div>
    )
  }
}

JavaPlaygroundExercise.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(JavaPlaygroundExercise)
