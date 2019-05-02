import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField';
import SendIcon from '@material-ui/icons/Send';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';


const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  formControl: {
		margin: theme.spacing.unit,
    width: '100%',
    align: 'center'
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
});

class ExamForm extends React.Component {
  state = {
    title: "Ingrese aquí el título del examen",
    date: null,
    exam_state: null,
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

  handleSubmit(event) {
    alert('The form has been submitted!');
    event.preventDefault();
  }


  render() {
    const { classes } = this.props;

    return (
      <form onSubmit={this.handleSubmit}>
        <div className={classes.root}>
          <Grid container spacing={24}>
            <Grid item xs={6}>
              <TextField
                id="filled-full-width"
                label="Título del Examen"
                style={{ margin: 8 }}
                className={classes.formControl}
                placeholder={this.state.title}
                onChange={this.handleChange}
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
              value={this.state.exam_time}
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
                label="Comentarios generales sobre examen"
                style={{ margin: 8 }}
                className={classes.formControl}
                placeholder="Ingrese los comentarios sobre el examen"
                multiline
                margin="normal"
                variant="filled"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={3}>
              {/*<Button 
                variant="contained" 
                color="primary" 
                className={classes.button}
                onClick={this.handleSubmit}
              >
                Crear examen
                <SendIcon className={classes.rightIcon} />
              </Button>
              */}
            </Grid>
          </Grid>
        </div>
        
      </form>
    );
  }
}

ExamForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ExamForm);