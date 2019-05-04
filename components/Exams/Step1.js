import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CreateExamForm from './CreateExamForm.js';




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

  state = {
    data: {
      description: "",
      startingAt: "2019-10-06T15:00:00",
      // exam_state: null,
      duration: "",
      // number_of_exercises: 0
    }
  }

  handleChange = (event) => {
    console.log("ASDASDASD")
    console.log(event.target.name);
    // check it out: we get the evt.target.name (which will be either "email" or "password")
    // and use it to target the key on our `state` object with the same name, using bracket syntax
    this.setState({ 
      data: { ...this.state.data, [event.target.name]: event.target.value }
    });
    console.log(event.target.value);
  }

  handleSubmit = (event) => {
    alert('The form has been submitted!');
    event.preventDefault();
  }

  createExamHandler = () => {
    console.log('POST sent this: ', this.state.data);
    fetch('http://localhost:8000/exams', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(this.state.data)
    })
    .then((res) => console.log('headers are ', res.headers))
    .then((data) => console.log('DATA is ', data))
    .catch((err) => console.log(err))
  } 

  render() {
    const { classes } = this.props;

    if (this.props.currentStep !== 1) {
      return null
    }
    return (
      <div className="form-group">

        {/* onChange={this.props.handleChange} // Prop: Puts data into state */}

        <CreateExamForm
          data={this.state.data}
          handleChange={this.handleChange}
          createExamHandler={this.createExamHandler}
          handleSubmit={this.handleSubmit}
        />

      </div>
    )
  }
}

Step1.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Step1);