import React from "react"
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import ExerciseInputs from "./ExerciseInputs"
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";



const styles = theme => ({
  margin: {
    margin: theme.spacing.unit,
  },
  extendedIcon: {
    marginRight: theme.spacing.unit,
  },
});

class ExercisesForm extends React.Component {
  state = {
    exercises: [{description:""}],
		description: ""
	}
	
	handleChange = (e) => {
		if (["description"].includes(e.target.className) ) {
			let exercises = [...this.state.exercises]
			exercises[e.target.dataset.id][e.target.className] = e.target.value.toUpperCase()
			this.setState({ exercises }, () => console.log(this.state.exercises))
		} else {
			this.setState({ [e.target.description]: e.target.value.toUpperCase() })
		}
	}

	addExercise = () => {
		this.setState((prevState) => ({
			exercises: [...prevState.exercises, {description:""}],
		}));
	}

	handleSubmit = (e) => { e.preventDefault() }

	render() {
		const { classes } = this.props;
		let {exercises} = this.state
	
		return (
			<div>
				<Grid container spacing={24}>
          {/* RUBY EDITOR */}
					<Grid container spacing={24}>
					<Grid item xs={12}>
						<ExerciseInputs exercises={exercises} />
					</Grid>
					<Grid item xs={1}>
						<Button variant="contained" size="small" color="primary" className={classes.margin} onClick={this.addExercise}>
							Agregar ejercicio
						</Button>
					</Grid>
				</Grid>

          {/* RUBY OUTPUT */}
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom>
              Output of the Ruby editor
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
                (pending ? "👩🏻‍🚀 bringing your output from Mars..." : "")
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

ExercisesForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ExercisesForm);