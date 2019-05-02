import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
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
	button: {
    margin: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
});

class Step3 extends React.Component {
  render() {
    const { classes } = this.props;
		
    if (this.props.currentStep !== 3) {
			return null
		} 
		return(
			<React.Fragment>
			<div className="form-group">
				<label htmlFor="password">Password</label>
				<input
					className="form-control"
					id="password"
					name="password"
					type="password"
					placeholder="Enter password"
					value={this.props.password}
					onChange={this.props.handleChange}
					/>      
			</div>
			<button className="btn btn-success btn-block">Sign up</button>
			</React.Fragment>
		);
	}
}

Step3.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Step3);