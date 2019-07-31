import React, { Component } from "react";
import dynamic from "next/dynamic";
const RubyEditor = dynamic(import("./RubyEditor"), { ssr: false });

import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import SendIcon from "@material-ui/icons/Send";
import { withStyles } from "@material-ui/core/styles";

import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";

import Typography from "@material-ui/core/Typography";


const styles = theme => ({
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
});

class RubyPlaygroundExercise extends Component {
  state = {
    output: {},
    code: "ARGV.each do |a|\n\tputs a\nend\n",
    timeout: 1000,
    language: "RUBY",
    // inputs: ["Hola", "Como", "andas?", "Re bien!", "ñoño", "人物"]
    input: ""
  };

  sendCodeinSandBox = () => {
    console.log("POST sent this: ", this.state.code);
    const final_input = this.state.input.split(',').map(str => str.replace(/\s/g, ''));
    // console.log('ARRAY: ', final_input);

    fetch("http://localhost:8009/execution-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: this.state.code,
        timeout: this.state.timeout,
        language: this.state.language,
        inputs: final_input
      })
    })
      .then(res => {
        console.log("RESPONSE IS: ", res.headers.get("Location"));
        let result_id = res.headers.get("Location").split("/");
        result_id = result_id[result_id.length - 1];
        console.log("RESULT_ID IS: ", result_id);

        // once the code is executed, wait for the response on the output box
        this.polling(result_id);
      })
      .catch(err => console.log(err));
  };

  polling = result_id => {
    this.IntervalPolling = setInterval(() => {
      let url =
        "http://localhost:8009/execution-requests/" + result_id + "/result/";
      console.log("url: ", url);
      fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      })
        .then(async res => {
          const outputJSONResponse = await res.json();
          console.log("json: ", outputJSONResponse);
          if (
            outputJSONResponse &&
            (outputJSONResponse.type === "FINISHED" ||
              outputJSONResponse.type === "UNKNOWN_ERROR")
          ) {
            console.log(
              "Finished polling, state is: ",
              outputJSONResponse.type
            );
            this.setState({ output: outputJSONResponse });
            clearInterval(this.IntervalPolling);
          }
        })
        .catch(err => console.log(err));
    }, 3000);
  };

  onCodeChange = code => this.setState({ code });

  onInputChange = input => {
    // console.log("INPUT: ", input.target.value);
    this.setState({ input: input.target.value });
  }
    

  render() {
    const { classes } = this.props;
    // console.log(this.state.code);

    const output =
      this.state.output.type === "UNKNOWN_ERROR"
        ? "COMPILATION ERROR"
        : (this.state.output.stdout || []).reduce(
            (memo, line) => memo + line + "\n",
            ""
          );

    return (
      <div>
        <Typography variant="h4" gutterBottom>
          Ruby programming language playground
        </Typography>
        <Grid container spacing={24}>
          {/* INPUTS */}
          <Grid item xs={3}>
            <TextField
              id="outlined-full-width"
              label="Insert comma separated inputs for the program"
              style={{ margin: 8 }}
              rows="1"
              placeholder="input1, input2, input3"
              onChange={this.onInputChange}
              value={this.state.input}
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

          {/* RUBY OUTPUT */}
          <Grid item xs={12} sm={6}>
            <TextField
              id="outlined-full-width"
              label="Output of the Ruby editor"
              style={{ margin: 8 }}
              multiline
              rows="18"
              placeholder="You will see the output of the editor here..."
              //helperText="Full width!"
              value={output}
              fullWidth
              margin="normal"
              variant="outlined"
              InputLabelProps={{
                shrink: true
              }}
            />
          </Grid>
        </Grid>
      </div>
    );
  }
}

RubyPlaygroundExercise.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(RubyPlaygroundExercise);
