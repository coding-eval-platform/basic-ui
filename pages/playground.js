import Layout from "../components/MyLayout.js";
import RubyPlaygroundExercise from "../components/Editors/RubyPlaygroundExercise.js";
import JavaPlaygroundExercise from "../components/Editors/JavaPlaygroundExercise.js";
import CPlaygroundExercise from "../components/Editors/CPlaygroundExercise.js";

import React, { Component } from "react";
import PropTypes from "prop-types";

import Typography from "@material-ui/core/Typography";

class Playground extends Component {
  state = {
    value: "ruby"
  };

  handleRadioButton(value) {
    this.setState({
      value: value
    });
  }

  render() {
    return (
      <div>
        <Layout>
          <Typography variant="h5" gutterBottom>
            Select a language to play with:
            &nbsp;
            <input
              type="radio"
              checked={this.state.value === "ruby"}
              onChange={() => this.handleRadioButton("ruby")}
            />
            Ruby
            &nbsp;
            <input
              type="radio"
              checked={this.state.value === "java"}
              onChange={() => this.handleRadioButton("java")}
            />
            Java
            &nbsp;
            <input
              type="radio"
              checked={this.state.value === "c"}
              onChange={() => this.handleRadioButton("c")}
            />
            C
          </Typography>

          { this.state.value === 'ruby' ? <RubyPlaygroundExercise /> : 
            this.state.value === 'java' ? <JavaPlaygroundExercise /> :
            <CPlaygroundExercise />
          }
          

          {/* <hr style={{ margin: 50 }} /> */}

          {/* <JavaPlaygroundExercise /> */}

          {/* <hr style={{ margin: 50 }} /> */}

          {/* <CPlaygroundExercise /> */}
        </Layout>
      </div>
    );
  }
}

Playground.propTypes = {
  classes: PropTypes.object.isRequired
};

export default Playground;
// export default withStyles(styles)(RubyPlaygroundExercise);
