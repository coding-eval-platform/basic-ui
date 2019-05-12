import React from "react"
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import ExerciseInputs from "./ExerciseInputs"

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
    owner: "",
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
			<form onSubmit={this.handleSubmit} onChange={this.handleChange} >
				<Grid container spacing={24}>
					<Grid item xs={8}>
						<ExerciseInputs exercises={exercises} />
					</Grid>
					<Grid item xs={4}>
						<Button variant="contained" size="small" color="primary" className={classes.margin} onClick={this.addExercise}>
							Agregar ejercicio
						</Button>
					</Grid>
				</Grid>
			</form>
		)
	}
}

ExercisesForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ExercisesForm);