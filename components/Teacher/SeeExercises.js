import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';

import Tooltip from '@material-ui/core/Tooltip';

import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import EditIcon from '@material-ui/icons/Edit';

const styles = theme => ({
  margin: {
    margin: theme.spacing.unit,
  },
  appBar: {
    position: 'relative',
  },
  flex: {
    flex: 1,
  },
});

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class SeeExercises extends React.Component {
  state = {
    exercises: [],
    open: false,
    openNewExerciseModal: false,
    openEditExerciseModal: false,
  };

  handleClickOpen = () => {
    const url = 'http://localhost:8000/exams/' +
      this.props.id +
      '/exercises'

    console.log('the url is: ', url);

    fetch(url)
      .then(res => res.json())
      .then(json => {
        this.setState({
          open: true,
          exercises: json,
        })
      });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  // handleAddExercise = (index, event) => {
  //   const exercises = Object.assign([], this.state.exercises);
  //   console.log('Add exercise to exam ID: ', this.props.id);

  //   const url = 'http://localhost:8000/exams/' +
  //     this.props.id +
  //     '/exercises'

  //   exercises.append(index, 1);
  //   this.setState({ exercises: exercises });

  //   // then hit the API 
  //   fetch(url, {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(this.state.data)
  //   })
  //     .then(res => res.text()) // OR res.json()
  //     .then(res => console.log(res))
  // }


  handleDeleteExercise = (index, event) => {
    const exercises = Object.assign([], this.state.exercises);
    console.log('Deleting exercise with ID: ', this.props.id);

    const url = 'http://localhost:8000/exams/' +
      this.props.id +
      '/exercises'

    exercises.splice(index, 1);
    this.setState({ exercises: exercises });

    // then hit the API 
    fetch(url, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.text()) // OR res.json()
      .then(res => console.log(res))
  }

  openNewExerciseModal = () => {
    this.setState({ openNewExerciseModal: true });
  };

  closeNewExerciseModal = () => {
    this.setState({ openNewExerciseModal: false });
  };

  openEditExerciseModal = () => {
    this.setState({ openEditExerciseModal: true });
  };

  closeEditExerciseModal = () => {
    this.setState({ openEditExerciseModal: false });
  };

  editQuestion = exerciseId => {
    this.setState(state => {
      const exercises = state.exercises.map(item => {
        if (item.id === exerciseId) {
          item.question = 'hola!';
          // hit API endpoint here
          return item;
        } else {
          return item;
        }
      });

      console.log(exercises);

      return {
        exercises,
      };
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Tooltip title="Edit exercises">
          <IconButton
            className={classes.button}
            // className={classes.margin}
            aria-label="Edit"
            size="small"
            onClick={this.handleClickOpen}
            color="primary">
            <EditIcon/>
          </IconButton>
        </Tooltip>
        <Dialog
          fullScreen
          open={this.state.open}
          onClose={this.handleClose}
          TransitionComponent={Transition}
        >
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton color="inherit" onClick={this.handleClose} aria-label="Close">
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" color="inherit" className={classes.flex}>
                Exam: {this.props.description}
              </Typography>
              <Button color="inherit" onClick={this.handleClose}>
                Close
              </Button>
            </Toolbar>
          </AppBar>




          <List>

            {this.state.exercises.map((exercise, index) => (
              <ListItem button key={index}>
                <ListItemText
                  primary={"Question number: " + exercise.id}
                  secondary={exercise.question}
                />
                {/* <Button color="inherit" onClick={this.editQuestion.bind(this, exercise.id)}> */}
                <Button color="inherit" onClick={this.openEditExerciseModal}>

                  Edit question
                </Button>

                <Dialog
                  fullWidth
                  maxWidth="lg"
                  open={this.state.openEditExerciseModal}
                  onClose={this.closeEditExerciseModal}
                  aria-labelledby="form-dialog-title"
                >
                  <DialogTitle id="form-dialog-title">Edit the exercise</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      Edit all the details of this exercise
            </DialogContentText>
                    <TextField
                      autoFocus
                      margin="dense"
                      id="name"
                      label="Question"
                      type="text"
                      fullWidth
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={this.closeEditExerciseModal} color="primary">
                      Cancel changes
            </Button>
                    <Button onClick={this.closeEditExerciseModal} color="primary">
                      Update
            </Button>
                  </DialogActions>
                </Dialog>





                <Button color="inherit" onClick={this.handleDeleteExercise}>
                  Delete exercise
                </Button>
              </ListItem>
            ))}

          </List>









          {/* CREATE A NEW EXERCISE */}
          <Button
            color="primary"
            variant="outlined"
            onClick={this.openNewExerciseModal}
          >
            Add exercise
          </Button>
          <Dialog
            fullWidth
            maxWidth="lg"
            open={this.state.openNewExerciseModal}
            onClose={this.closeNewExerciseModal}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">Create a new exercise</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Please insert here all the details about this exercise.
            </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Question"
                type="text"
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={this.closeNewExerciseModal} color="primary">
                Cancel
            </Button>
              <Button onClick={this.closeNewExerciseModal} color="primary">
                Create
            </Button>
            </DialogActions>
          </Dialog>

        </Dialog>
      </div>
    );
  }
}

SeeExercises.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SeeExercises);