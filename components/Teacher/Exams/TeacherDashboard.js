import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'

import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Router from 'next/router'

import ExamRow from './ExamRow.js'
import store from 'store'
import { handleAccessToken } from '../../../auth'
import { withSnackbar } from 'notistack'

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto'
  }
})

class TeacherDashboard extends React.Component {
  state = {
    exams: [],
    isLoaded: false
  }

  componentWillMount = async () => {
    const accessToken = await handleAccessToken()
  }

  componentDidMount = () => {
    const url = `${process.env.API_HOST}/exams?size=100&page=0&sort=description,asc`

    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + store.get('accessToken')
      }
    })
      .then(async res => {
        const outputJSONResponse = await res.json()
        // console.log("The JSON with all the exams is: ", outputJSONResponse);

        this.setState({
          isLoaded: true,
          exams: outputJSONResponse
        })
      })
      .catch(err => console.log(err))
  }

  deleteExam = index => {
    if (window.confirm('Are you sure you want to delete this exam?')) {
      console.log('Deleting exam with ID: ', this.state.exams[index].id)
      this.props.enqueueSnackbar('Deleting exam', { variant: 'info' })
      const url = `${process.env.API_HOST}/exams/${this.state.exams[
        index
      ].id.toString()}`

      // then hit the API
      fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + store.get('accessToken')
        }
      })
        .then(res => {
          if (res.status === 204) {
            this.props.enqueueSnackbar('Exam deleted', { variant: 'success' })
            // Removes the desired item.
            this.state.exams.splice(index, 1)
            this.setState({ exams: this.state.exams })
          } else if (res.status === 422) {
            this.props.enqueueSnackbar('Exam should be in UPCOMING state', {
              variant: 'warning'
            })
          } else {
            this.props.enqueueSnackbar('Failed to delete exam', {
              variant: 'error'
            })
          }
        })
        .catch(err => console.log(err))
    }
  }

  startExamHandler = index => {
    if (window.confirm('Are you sure you want to start this exam?')) {
      console.log('Starting exam with ID: ', this.state.exams[index].id)
      this.props.enqueueSnackbar('Starting exam', { variant: 'info' })
      const url = `${process.env.API_HOST}/exams/${this.state.exams[
        index
      ].id.toString()}/start`

      // then hit the API
      fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + store.get('accessToken')
        }
      })
        .then(res => {
          if (res.status === 204) {
            this.props.enqueueSnackbar('Exam started', { variant: 'success' })
            // Change the state in that item
            this.state.exams[index].state = 'IN_PROGRESS'
            this.setState({ exams: this.state.exams })
          } else if (res.status === 422) {
            if (
              this.state.exams[index].state.toString() === 'FINISHED' ||
              this.state.exams[index].state.toString() === 'IN_PROGRESS'
            ) {
              this.props.enqueueSnackbar('Exam should be in UPCOMING state', {
                variant: 'warning'
              })
            } else {
              this.props.enqueueSnackbar(
                'Exam has no exercises or an exercise does not have a private test case.',
                {
                  variant: 'warning'
                }
              )
            }
          } else {
            this.props.enqueueSnackbar('Failed to start exam', {
              variant: 'error'
            })
          }
        })
        .catch(err => console.log(err))
    }
  }

  finishExamHandler = index => {
    if (window.confirm('Are you sure you want to start this exam?')) {
      this.props.enqueueSnackbar('Finishing exam', { variant: 'info' })
      const url = `${process.env.API_HOST}/exams/${this.state.exams[
        index
      ].id.toString()}/finish`

      // then hit the API
      fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + store.get('accessToken')
        }
      })
        .then(res => {
          if (res.status === 204) {
            this.props.enqueueSnackbar('Exam finished', { variant: 'success' })

            // Change the state in that item
            this.state.exams[index].state = 'FINISHED'
            this.setState({ exams: this.state.exams })
          } else if (res.status === 422) {
            this.props.enqueueSnackbar('Exam should be in IN_PROGRESS state', {
              variant: 'warning'
            })
          } else {
            this.props.enqueueSnackbar('Failed to finish exam', {
              variant: 'error'
            })
          }
        })
        .catch(err => console.log(err))
    }
  }

  createExam = () => {
    Router.push(`/create_exam`)
  }

  render() {
    const { classes } = this.props
    if (!this.state.isLoaded) {
      return <div>Loading...</div>
    } else if (this.state.exams < 1) {
      return (
        <div>
          <Typography variant="h6" style={{ margin: 20 }} gutterBottom>
            You have no exams created yet 🤷‍♂️
          </Typography>
          <Grid container spacing={24} alignItems="center">
            <Grid item xs={6}>
              <Button
                style={{ margin: 20 }}
                variant="contained"
                color="primary"
                onClick={this.createExam}
              >
                Create one!
              </Button>
            </Grid>
          </Grid>
        </div>
      )
    } else {
      return (
        <div>
          <Typography variant="h6" style={{ margin: 20 }} gutterBottom>
            All your exams 📚
          </Typography>
          <Grid container spacing={24} alignItems="center">
            <Grid item xs={6}>
              <Button
                style={{ margin: 20 }}
                variant="contained"
                color="primary"
                onClick={this.createExam}
              >
                Create exam
              </Button>
            </Grid>
          </Grid>
          <Paper className={classes.root}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell align="center" style={{ maxWidth: '2px' }}>
                    Exam ID
                  </TableCell>
                  <TableCell align="center">Title</TableCell>
                  <TableCell align="center">Starting Date & Time</TableCell>
                  <TableCell align="center">Expected Duration</TableCell>
                  <TableCell align="center">State</TableCell>
                  <TableCell align="center">Actual Starting Moment</TableCell>
                  <TableCell align="center">Actual Duration</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* {console.log("los exams sons: ", this.state.exams)} */}
                {this.state.exams.map((exam, index) => (
                  <ExamRow
                    key={index}
                    id={exam.id}
                    description={exam.description}
                    startingAt={exam.startingAt}
                    duration={exam.duration}
                    state={exam.state}
                    actualStartingMoment={exam.actualStartingMoment}
                    actualDuration={exam.actualDuration}
                    deleteEvent={this.deleteExam.bind(this, index)}
                    startExam={this.startExamHandler.bind(this, index)}
                    finishExam={this.finishExamHandler.bind(this, index)}
                  />
                ))}
              </TableBody>
            </Table>
          </Paper>
        </div>
      )
    }
  }
}

TeacherDashboard.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withSnackbar(withStyles(styles)(TeacherDashboard))
