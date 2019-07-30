import React, { Component } from "react";
import dynamic from "next/dynamic";
const CEditor = dynamic(import("./CEditor"), { ssr: false });

import PropTypes from "prop-types";
import classNames from "classnames";
import Button from "@material-ui/core/Button";
import SendIcon from "@material-ui/icons/Send";
import SaveIcon from "@material-ui/icons/Save";
import { withStyles } from "@material-ui/core/styles";

import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";

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

class CPlaygroundExercise extends Component {
  state = {
    output: {},
    code:
      '#include <stdio.h>\n#include <unistd.h>\n\nint main(int argc, char *argv[]) {\n\tfor (int i = 0; i < argc; i++) {\n\t\tprintf("%s\\n", argv[i]);\n\t}\n\tsleep(1);\n\treturn 0;\n}',
    timeout: 1002,
    language: "C",
    inputs: ["Hola", "Como", "andas?", "Re bien!", "ñoño", "人物"]
  };

  sendCodeinSandBox = () => {
    console.log("POST sent this: ", this.state.code);

    fetch("http://localhost:8009/execution-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: this.state.code,
        timeout: this.state.timeout,
        language: this.state.language,
        inputs: this.state.inputs
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

  render() {
    const { classes } = this.props;
    console.log(this.state.code);

    const output =
      this.state.output.type === "UNKNOWN_ERROR"
        ? "COMPILATION ERROR"
        : (this.state.output.stdout || []).reduce(
            (memo, line) => memo + line + "\n",
            ""
          );

    return (
      <div>
        <Grid container spacing={24}>
          {/* C EDITOR */}
          <Grid item xs={6}>
            <CEditor codeToRun={this.state.code} onChange={this.onCodeChange} />
          </Grid>

          {/* C OUPUT */}
          <Grid item xs={6}>
            <TextField
              id="outlined-full-width"
              label="Ouput of the Java editor"
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
      </div>
    );
  }
}

CPlaygroundExercise.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CPlaygroundExercise);
