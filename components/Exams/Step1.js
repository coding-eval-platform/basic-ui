import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';


import { MuiPickersUtilsProvider, DateTimePicker } from "material-ui-pickers";
import MomentUtils from "@date-io/moment";

import Link from 'next/link'


const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  formControl: {
    margin: theme.spacing.unit,
    width: '100%',
    align: 'center'
  },
  button: {
    margin: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
});


class Step1 extends React.Component {

  state = {
    data: {
      description: "",
      // startingAt: "2019-10-06T15:00:00",
      startingAt: "2019-10-06T15:00:00",
      // exam_state: null,
      duration: "",
      // exercises: []
    }
  }

  handleChange = (event) => {
    // console.log(event.target.name);
    // check it out: we get the evt.target.name (which will be either "email" or "password")
    // and use it to target the key on our `state` object with the same name, using bracket syntax
    this.setState({
      data: { ...this.state.data, [event.target.name]: event.target.value }
    });
    // console.log(event.target.value);
  }

  handleSubmit = (event) => {
    alert('The form has been submitted!');
    event.preventDefault();
  }

  createExamHandler = () => {
    console.log('POST sent this: ', this.state.data);
    fetch('http://localhost:8000/exams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.state.data)
    })
      .then((res) => console.log('RESPONSE IS: ', res.headers.get('Location')))
      .catch((err) => console.log(err))
  }

  render() {
    const { classes } = this.props;

    return (
      <div>

        {/* onChange={this.props.handleChange} // Prop: Puts data into state */}

        <Grid container spacing={24}>
          <Grid item xs={6}>

            <TextField
              id="filled-full-width"
              label="Título del Examen"
              style={{ margin: 8 }}
              className={classes.formControl}
              placeholder="Inserte el titulo el examen aqui"
              value={this.state.data.description}
              name="description"
              onChange={this.handleChange}
              margin-top="normal"
              variant="filled"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={6}>
          </Grid>
          <Grid item xs={3}>

            <MuiPickersUtilsProvider utils={MomentUtils}>
              <DateTimePicker
                label="Fecha y hora de comienzo del examen"
                value={this.state.date}
                onChange={this.handleDateChange}
              />
            </MuiPickersUtilsProvider>
            {/* <TextField
              id="datetime-local"
              label="Fecha y hora de comienzo del examen"
              type="datetime-local"
              defaultValue="2017-05-24T10:30"
              value={this.state.data.startingAt}
              className={classes.formControl}
              InputLabelProps={{
                shrink: true,
              }}
            /> */}

          </Grid>
          <Grid item xs={3}>
            <TextField
              id="filled-full-width"
              label="Duración del examen (mins)"
              value={this.state.data.duration}
              onChange={this.handleChange}
              name="duration"
              className={classes.formControl}
              InputLabelProps={{
                shrink: true,
              }}
              margin="normal"
              variant="filled"
            />
          </Grid>
          <Grid item xs={6}>
          </Grid>
          <Grid item xs={6}>
            <Link href="/create_exercises">
              <Button
                variant="contained"
                className={classes.button}
                onClick={this.createExamHandler}
              >
                Crear examen
      </Button>
            </Link>
          </Grid>

        </Grid>

      </div>
    )
  }
}

Step1.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Step1);