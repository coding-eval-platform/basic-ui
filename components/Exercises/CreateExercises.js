import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import ExercisesForm from './ExercisesForm.js'


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

class CreateExercises extends React.Component {
	
  render() {
		
		return(
			<div className="form-group">
				{/*<input
					className="form-control"
					id="username"
					name="username"
					type="text"
					placeholder="Enter username"
					value={this.props.username}
					onChange={this.props.handleChange}
				/>*/}
				<ExercisesForm/>
			</div>
		);
	}
}

CreateExercises.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CreateExercises);