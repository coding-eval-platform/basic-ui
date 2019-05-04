import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import ExamRow from './ExamRow.js'

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
});

class TeacherDashboard extends React.Component {

  state = {
    items: [],
    isLoaded: false,
  }

  componentDidMount = () => {
    fetch('http://localhost:8000/exams?size=10&page=0&sort=description,asc')
      .then(res => res.json())
      .then(json => {
        this.setState({
          isLoaded: true,
          items: json,
        })
      });
  }

  deleteExamHandler = (index, event) => {
    const items = Object.assign([], this.state.items);
    console.log('Deleting exam with ID: ', items[index].id);

    const url = 'http://localhost:8000/exams/' + items[index].id.toString()

    items.splice(index, 1);
    this.setState({ items: items });

    // then hit the API 
    fetch(url, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.text()) // OR res.json()
      .then(res => console.log(res))
  }

  render() {
    const { classes } = this.props;
    console.log(this.state.isLoaded);
    if (!this.state.isLoaded) {
      return <div>Loading...</div>
    }
    else {
      return (
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Exam Identifier</TableCell>
                <TableCell align="center">Description</TableCell>
                <TableCell align="center">Starting At</TableCell>
                <TableCell align="center">Duration</TableCell>
                <TableCell align="center">State</TableCell>
                <TableCell align="center">Actual Starting Moment</TableCell>
                <TableCell align="center">Actual Duration</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>

              {this.state.items.map((item, index) => (
                <ExamRow
                  deleteEvent={this.deleteExamHandler.bind(this, index)}
                  id={item.id}
                  description={item.description}
                  startingAt={item.startingAt}
                  duration={item.duration}
                  state={item.state}
                  actualStartingMoment={item.actualStartingMoment}
                  actualDuration={item.actualDuration}
                // changeEvent={this.changeUserName.bind(this, user.description)}
                // key={user.id }
                />
              ))}
            </TableBody>
          </Table>
        </Paper>
      )
    }
  }
}

TeacherDashboard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TeacherDashboard);