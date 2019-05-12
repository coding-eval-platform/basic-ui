import Step1 from './Step1.js'
import Step2 from './Step2.js'
import Step3 from './Step3.js'

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
  input: {
    display: 'none',
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
});


class MasterForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentStep: 1,
			step1_done: false,
			step2_done: false,
      step3_done: false,
    }
  }

  handleChange = event => {
    const {name, value} = event.target
    this.setState({
      [name]: value
    })    
  }
   
  handleSubmit = event => {
    event.preventDefault();

    const { step1_done, step2_done, step3_done } = this.state;

    alert(`Your multi-step details are: \n 
           Datos generales del examen: ${step1_done} \n 
           Ejercicios creados: ${step2_done} \n
           Test cases para los ejericicios: ${step3_done}`
           )
  }
  
  _next = () => {
    let currentStep = this.state.currentStep
    currentStep = currentStep >= 2? 3: currentStep + 1
    this.setState({
      currentStep: currentStep
    })
  }
    
  _prev = () => {
    let currentStep = this.state.currentStep
    currentStep = currentStep <= 1? 1: currentStep - 1
    this.setState({
      currentStep: currentStep
    })
  }

  previousButton() {
    const { classes } = this.props;
    let currentStep = this.state.currentStep;
    if(currentStep !==1){
      return (
        <Button 
          variant="contained" 
          className={classes.button}
          onClick={this._prev}
          >
        Paso anterior
        </Button>
      )
    }
    return null;
  }

  nextButton(){
    const { classes } = this.props;
    let currentStep = this.state.currentStep;
    if(currentStep <3){
      return (
      <Button 
        variant="contained" 
        className={classes.button}
        onClick={this._next}
        >
        Paso siguiente
      </Button>
      )
    }
    return null;
  }
  
  render() {    
    const { classes } = this.props;
		
    return (
      <React.Fragment>
      <h3>Paso de creación de examen: {this.state.currentStep} </h3> 

      <form onSubmit={this.handleSubmit}>
      {/* 
        render the form steps and pass required props in
      */}
          {/* email={this.state.email} */}
        <Step1 
          currentStep={this.state.currentStep} 
          handleChange={this.handleChange}
        />
          {/* username={this.state.username} */}
        <Step2 
          currentStep={this.state.currentStep} 
          handleChange={this.handleChange}
        />
          {/*password={this.state.password} */}
        <Step3 
          currentStep={this.state.currentStep} 
          handleChange={this.handleChange}
        />
        {this.previousButton()}
        {this.nextButton()}

      </form>
      </React.Fragment>
    );
  }
}


MasterForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MasterForm);
