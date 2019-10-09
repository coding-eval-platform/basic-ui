import React, { Component } from 'react'
import dynamic from 'next/dynamic'
const CEditor = dynamic(import('./CEditor'), { ssr: false })

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

class CExamExercise extends Component {
  state = {
    output: {},
    stdin: '',
    compilerFlags: '',
    pending: false,
    code: '',
    timeout: '',
    language: 'C',
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

  onProgramArgumentsChange = programArguments => {
    this.setState({ programArguments: programArguments.target.value })
  }

  onStdinChange = stdin => {
    this.setState({ stdin: stdin.target.value })
  }

  onCompilerFlagsChange = compilerFlags => {
    this.setState({ compilerFlags: compilerFlags.target.value })
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
          C programming language playground
        </Typography> */}
        <Grid container spacing={24} alignItems="center">
          {/* INPUTS */}
          <Grid item xs={3}>
            <TextField
              id="outlined-full-width"
              label="Insertar argumentos del programa"
              style={{ margin: 8 }}
              rows="19"
              placeholder="input1, input2, input3"
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
              label="Insertar input del programa"
              style={{ margin: 8 }}
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

            <TextField
              id="outlined-full-width"
              label="Insert GCC Compile Flags"
              style={{ margin: 8 }}
              rows="1"
              placeholder="-Wall -g"
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

          {/* EXECUTES */}
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
          </Grid>
        </Grid>

        {/* C EDITOR */}
        <Grid container spacing={24}>
          <Grid item xs={12} sm={6}>
            <CEditor codeToRun={this.state.code} onChange={this.onCodeChange} />
          </Grid>

          {/* C OUPUT */}
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom>
              Output of the C editor
            </Typography>
            <TextField
              id="outlined-full-width"
              // label="Ruby editor (stdout)"
              style={{ margin: 0 }}
              multiline
              rows="17"
              placeholder="La salida estándar aparecerá aquí...."
              //helperText="Full width!"
              value={output || (pending ? '👩🏻‍🚀 Buscando la respuesta...' : '')}
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

CExamExercise.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(CExamExercise)
