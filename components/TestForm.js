import React from "react"
import ExerciseInputs from "./ExerciseInputs"
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  margin: {
    margin: theme.spacing.unit,
  },
  extendedIcon: {
    marginRight: theme.spacing.unit,
  },
});

class TestForm extends React.Component {
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

	addExercise = (e) => {
		this.setState((prevState) => ({
			exercises: [...prevState.exercises, {description:""}],
		}));
	}

	handleSubmit = (e) => { e.preventDefault() }

	render() {
		const { classes } = this.props;
		let {owner, description, exercises} = this.state
		
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

TestForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TestForm);