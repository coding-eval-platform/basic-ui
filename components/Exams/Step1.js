import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ExamForm from './ExamForm.js'
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

class Step1 extends React.Component {
	
  render() {
    const { classes } = this.props;
		
    if (this.props.currentStep !== 1) { 
      return null
    }
    return(
      <div className="form-group">

      {/* onChange={this.props.handleChange} // Prop: Puts data into state */}
      
        <ExamForm/>
      </div>
    )
  }
}

Step1.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Step1);