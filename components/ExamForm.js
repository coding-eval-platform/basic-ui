import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import FilledInput from '@material-ui/core/FilledInput';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import TextField from '@material-ui/core/TextField';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  formControl: {
		margin: theme.spacing.unit,
    width: '100%',
    align: 'center'
  },
});

class ExamForm extends React.Component {
  state = {
    title: "Ingrese aquí el título del examen",
    duration: 0,
    number_of_exercises: 0
  };

  componentDidMount() {
    this.forceUpdate();
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };


  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Grid container spacing={24}>
          <Grid item xs={6}>
            <TextField
              id="filled-full-width"
              label="Título del Examen"
              style={{ margin: 8 }}
              className={classes.formControl}
              placeholder={this.state.title}
              margin-top="normal"
              variant="filled"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
            id="datetime-local"
            label="Fecha y hora de comienzo del examen"
            type="datetime-local"
            defaultValue="2017-05-24T10:30"
            className={classes.formControl}
            InputLabelProps={{
              shrink: true,
            }}
          />
          </Grid>
          <Grid item xs={3}>
            <TextField
              id="filled-number"
              label="Duración del examen (mins)"
              value={this.state.duration}
              onChange={this.handleChange('duration')}
              type="number"
              className={classes.formControl}
              InputLabelProps={{
                shrink: true,
              }}
              margin="normal"
              variant="filled"
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              id="filled-number"
              label="Cantidad de ejercicios"
              value={this.state.number_of_exercises}
              onChange={this.handleChange('number_of_exercises')}
              type="number"
              className={classes.formControl}
              InputLabelProps={{
                shrink: true,
              }}
              margin="normal"
              variant="filled"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              id="filled-full-width"
              label="Reglas generales del examen"
              style={{ margin: 8 }}
              className={classes.formControl}
              placeholder="Ingrese las reglas del examen"
              multiline='true'
              margin="normal"
              variant="filled"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        </Grid>
          

        
          

        
      </div>
    );
  }
}

ExamForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ExamForm);