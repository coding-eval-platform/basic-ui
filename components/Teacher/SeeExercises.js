import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
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

const styles = {
  appBar: {
    position: 'relative',
  },
  flex: {
    flex: 1,
  },
};

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class SeeExercises extends React.Component {
  state = {
    exercises: [],
    open: false,
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

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Button
          size="small"
          className={classes.margin}
          variant="outlined"
          color="primary"
          onClick={this.handleClickOpen}>
          See exercises
        </Button>
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
                save
              </Button>
            </Toolbar>
          </AppBar>
          <List>

            {this.state.exercises.map((exercise, index) => (
              <ListItem button>
                <ListItemText 
                primary={"Question number: " + exercise.id} 
                secondary={exercise.question} />
              </ListItem>
              // <Divider />

              ))
              }
          </List>
        </Dialog>
      </div>
    );
  }
}

SeeExercises.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SeeExercises);