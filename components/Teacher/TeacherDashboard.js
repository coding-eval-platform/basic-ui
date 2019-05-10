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

  // handleDescriptionChange = (index, event) => {
  //   const items = Object.assign([], this.state.items);
  //   console.log(items);

  //   console.log('Updating exam, old description is: ', items[index].description);
  //   items[index].description = event.target.value;
  //   console.log('Updating exam, new description is: ', items[index].description);

  //   this.setState({ items: items });

  //   const url = 'http://localhost:8000/exams/' + items[index].id.toString()

  //   // then hit the API 
  //   fetch(url, {
  //     method: 'PUT',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({
  //       description: items[index].description, 
  //     })
  //   })
  //     .then(res => res.text()) // OR res.json()
  //     .then(res => console.log(res))

  // }



  startExam = examId => {
    const items = Object.assign([], this.state.items);
    console.log(items);

    this.setState(state => {
      const items = state.items.map(item => {
        if (item.id === examId) {
          console.log('el exam es: ', item);
          // hit API endpoint here

          let url = 'http://localhost:8000/exams/' +
            item.id.toString() +
            '/start'

          fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              description: 'STARTED',
              startingAt: "2019-10-06T15:00:00",
              duration: "PT150M"
            })
          })
            .then(res => res.text()) // OR res.json()
            .then(res => console.log(res))
          return item;
        } else {
          return item;
        }
      });

      // SEE NEW STATE
      console.log(items);
      // CHANGE THE STATE
      return {
        items,
      };
    });

  }


  stopExam = examId => {
    const items = Object.assign([], this.state.items);
    console.log(items);

    this.setState(state => {
      const items = state.items.map(item => {
        if (item.id === examId) {
          console.log('el exam es: ', item);
          // hit API endpoint here

          let url = 'http://localhost:8000/exams/' +
            item.id.toString() +
            '/stop'

          fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              description: 'STOPPED',
              startingAt: "2019-10-06T15:00:00",
              duration: "PT150M"
            })
          })
            .then(res => res.text()) // OR res.json()
            .then(res => console.log(res))
          return item;
        } else {
          return item;
        }
      });

      // SEE NEW STATE
      console.log(items);
      // CHANGE THE STATE
      return {
        items,
      };
    });

  }


  render() {
    const { classes } = this.props;
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
                  key={index}
                  deleteEvent={this.deleteExamHandler.bind(this, index)}
                  id={item.id}
                  description={item.description}
                  startingAt={item.startingAt}
                  duration={item.duration}
                  state={item.state}
                  actualStartingMoment={item.actualStartingMoment}
                  actualDuration={item.actualDuration}
                  startExam={this.startExam.bind(this, item.id)}
                  stopExam={this.startExam.bind(this, item.id)}
                // onDescriptionChange={this.handleDescriptionChange.bind(this, index)}
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