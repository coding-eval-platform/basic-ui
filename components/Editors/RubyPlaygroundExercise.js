import React, { Component } from "react";
import dynamic from "next/dynamic";
const RubyEditor = dynamic(import("./RubyEditor"), { ssr: false });

import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import SendIcon from "@material-ui/icons/Send";
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

class RubyExercise extends Component {
  state = {
    code: "ARGV.each do |a|\n\tputs a\nend\n",
    timeout: 1000,
    language: "RUBY",
    inputs: ["Hola", "Como", "andas?", "Re bien!", "ñoño", "人物"]
  };

  sendCodeinSandBox = () => {
    console.log("POST sent this: ", this.state.code);

    fetch("http://localhost:8000/execution-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(this.state)
    })
      .then(res => {
        console.log("RESPONSE IS: ", res.headers.get("Location"));
        let result_id = res.headers.get("Location").split("/");
        result_id = result_id[result_id.length - 1];
				console.log("RESULT_ID IS: ", result_id);
				this.polling(result_id);
        // this.setState({
        //   exam_id
        // });
        // this.props.history.push(`/create_exercises/${exam_id}/`);
        //Router.push(`/create_exercises?exam_id=${exam_id}`);
      })
      .catch(err => console.log(err));
	};
	
	polling = (result_id) => {
		let url = "http://localhost:8000/execution-requests/" + result_id + "/result/"
		fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    })
      .then(res => {
        console.log("RESPONSE IS: ", res.headers.get("Location"));
        let result_id = res.headers.get("Location").split("/");
        result_id = result_id[result_id.length - 1];
				console.log("RESULT_ID IS: ", result_id);
				console.log(res);
        // this.setState({
        //   exam_id
        // });
        // this.props.history.push(`/create_exercises/${exam_id}/`);
        //Router.push(`/create_exercises?exam_id=${exam_id}`);
      })
      .catch(err => console.log(err));
	}

  handleChange = variable => event => {
    this.setState({ [variable]: event.target.value });
  };

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Grid container spacing={24}>
          {/* RUBY EDITOR */}
          <Grid item xs={6}>
            <RubyEditor codeToRun={this.state.code} />
          </Grid>

          {/* RUBY OUTPUT */}
          <Grid item xs={6}>
            <TextField
              id="outlined-full-width"
              label="Ouput of the Ruby editor"
              style={{ margin: 8 }}
              multiline
              rows="18"
              placeholder="You will see the output of the editor here..."
              //helperText="Full width!"
              value={this.state.code}
              onChange={this.handleChange("code")}
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
      </div>
    );
  }
}

RubyExercise.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(RubyExercise);
