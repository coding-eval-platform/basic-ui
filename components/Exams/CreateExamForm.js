import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';



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

const CreateExamForm = (props) => {

  const { classes } = props;

  return (
    <form onSubmit={props.handleSubmit}>
      <div className={classes.root}>
        <Grid container spacing={24}>
          <Grid item xs={6}>
              
            <TextField
              id="filled-full-width"
              label="Título del Examen"
              style={{ margin: 8 }}
              className={classes.formControl}
              placeholder="Inserte el titulo el examen aqui"
              value={props.data.description}
              name="description"
              onChange={props.handleChange}
              margin-top="normal"
              variant="filled"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="contained"
              className={classes.button}
              onClick={props.createExamHandler}
            >
              Crear examen
      </Button>

          </Grid>
          <Grid item xs={3}>
            <TextField
              id="datetime-local"
              label="Fecha y hora de comienzo del examen"
              type="datetime-local"
              defaultValue="2017-05-24T10:30"
              value={props.data.startingAt}
              className={classes.formControl}
              InputLabelProps={{
                shrink: true,
              }}
            />

          </Grid>
          <Grid item xs={3}>
            <TextField
              id="filled-full-width"
              label="Duración del examen (mins)"
              value={props.data.duration}
              onChange={props.handleChange}
              name="duration"
              className={classes.formControl}
              InputLabelProps={{
                shrink: true,
              }}
              margin="normal"
              variant="filled"
            />
          </Grid>

        </Grid>
      </div>

    </form>
  );
}

CreateExamForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CreateExamForm);