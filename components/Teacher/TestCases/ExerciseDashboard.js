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

import TestCaseRow from './TestCaseRow.js'
import { handleAccessToken } from '../../../auth'
import { withSnackbar } from 'notistack'
import store from 'store'

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto'
  }
})

class ExerciseDashboard extends React.Component {
  state = {
    exerciseID: '',
    exerciseQuestion: '',
    publicTestCases: [],
    privateTestCases: [],
    publicIsLoaded: false,
    privateIsLoaded: false
  }

  componentWillMount = async () => {
    const accessToken = await handleAccessToken()
  }

  componentDidMount = () => {
    const exerciseID = new URL(window.location.href).searchParams.get(
      'exerciseID'
    )
    const exerciseQuestion = new URL(window.location.href).searchParams.get(
      'exerciseQuestion'
    )
    const publicURL = `${
      process.env.API_HOST
    }/exercises/${exerciseID.toString()}/test-cases/public`
    const privateURL = `${
      process.env.API_HOST
    }/exercises/${exerciseID.toString()}/test-cases/private`

    this.setState({
      exerciseID: exerciseID,
      exerciseQuestion: exerciseQuestion
    })

    // PUBLIC TEST CASES
    fetch(publicURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + store.get('accessToken')
      }
    })
      .then(async res => {
        const outputJSONResponsePublicTestCases = await res.json()
        console.log(
          'The JSON with all the publicTestCases is: ',
          outputJSONResponsePublicTestCases
        )

        this.setState({
          publicIsLoaded: true,
          publicTestCases: outputJSONResponsePublicTestCases
        })
      })
      .catch(err => console.log(err))

    // PRIVATE TEST CASES
    fetch(privateURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + store.get('accessToken')
      }
    })
      .then(async res => {
        const outputJSONResponsePrivateTestCases = await res.json()
        console.log(
          'The JSON with all the privateTestCases is: ',
          outputJSONResponsePrivateTestCases
        )

        this.setState({
          privateIsLoaded: true,
          privateTestCases: outputJSONResponsePrivateTestCases
        })
      })
      .catch(err => console.log(err))
  }

  createTestCase = () => {
    Router.push({
      pathname: `/create_testcase`,
      query: {
        exerciseID: `${this.state.exerciseID}`,
        exerciseQuestion: `${this.state.exerciseQuestion}`
      }
    })
  }

  deletePublicTestCases = index => {
    if (window.confirm('Are you sure you want to delete this test case?')) {
      this.props.enqueueSnackbar('Deleting test case', { variant: 'info' })
      const url = `${
        process.env.API_HOST
      }/test-cases/${this.state.publicTestCases[index].id.toString()}`

      fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + store.get('accessToken')
        }
      })
        .then(res => {
          if (res.status === 204) {
            this.props.enqueueSnackbar('Test case deleted', {
              variant: 'success'
            })
            // Removes the desired item.
            this.state.publicTestCases.splice(index, 1)
            this.setState({ publicTestCases: this.state.publicTestCases })
          } else if (res.status === 422) {
            this.props.enqueueSnackbar('Exam should be in UPCOMING state', {
              variant: 'warning'
            })
          } else {
            this.props.enqueueSnackbar('Failed to delete test case', {
              variant: 'error'
            })
          }
        })
        .catch(err => console.log(err))
    }
  }

  deletePrivateTestCases = index => {
    if (window.confirm('Are you sure you want to delete this test case?')) {
      this.props.enqueueSnackbar('Deleting test case', { variant: 'info' })
      const url = `${
        process.env.API_HOST
      }/test-cases/${this.state.privateTestCases[index].id.toString()}`

      fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + store.get('accessToken')
        }
      })
        .then(res => {
          if (res.status === 204) {
            this.props.enqueueSnackbar('Test case deleted', {
              variant: 'success'
            })
            // Removes the desired item.
            this.state.privateTestCases.splice(index, 1)
            this.setState({ privateTestCases: this.state.privateTestCases })
          } else if (res.status === 422) {
            this.props.enqueueSnackbar('Exam should be in UPCOMING state', {
              variant: 'warning'
            })
          } else {
            this.props.enqueueSnackbar('Failed to delete test case', {
              variant: 'error'
            })
          }
        })
        .catch(err => console.log(err))
    }
  }

  render() {
    const { classes } = this.props
    return (
      <div>
        <Typography variant="h6" style={{ margin: 20 }} gutterBottom>
          All your test cases
        </Typography>
        <Grid container spacing={24} alignItems="center">
          <Grid item xs={6}>
            <Button
              style={{ margin: 20 }}
              variant="contained"
              color="primary"
              onClick={this.createTestCase}
            >
              Create test case
            </Button>
          </Grid>
        </Grid>
        {!this.state.publicIsLoaded ? (
          <div>Loading...</div>
        ) : this.state.publicTestCases < 1 ? (
          <div>
            <Typography variant="h6" style={{ margin: 20 }} gutterBottom>
              You have no test public cases created in this exercise yet 🤷‍♂️
            </Typography>
            <Grid container spacing={24} alignItems="center">
              <Grid item xs={6}>
                <Button
                  style={{ margin: 20 }}
                  variant="contained"
                  color="primary"
                  onClick={this.createTestCase}
                >
                  Create one!
                </Button>
              </Grid>
            </Grid>
          </div>
        ) : (
          <div>
            <Typography variant="h6" style={{ margin: 20 }} gutterBottom>
              Public Test cases of the exercise: {this.state.exerciseQuestion}
            </Typography>
            <Paper className={classes.root}>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell align="center" style={{ maxWidth: '2px' }}>
                      Test Case ID
                    </TableCell>
                    <TableCell align="center">Visibility</TableCell>
                    <TableCell align="center">Timeout (ms)</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.publicTestCases.map((testCase, index) => (
                    <TestCaseRow
                      key={index}
                      id={testCase.id}
                      visibility={testCase.visibility}
                      timeout={testCase.timeout}
                      inputs={testCase.inputs}
                      expectedOutputs={testCase.expectedOutputs}
                      deletePublicTestCases={this.deletePublicTestCases.bind(
                        this,
                        index
                      )}
                    />
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </div>
        )}

        {!this.state.privateIsLoaded ? (
          <div>Loading...</div>
        ) : this.state.privateTestCases < 1 ? (
          <div>
            <Typography variant="h6" style={{ margin: 20 }} gutterBottom>
              You have no test private cases created in this exercise yet 🤷‍♂️
            </Typography>
            <Grid container spacing={24} alignItems="center">
              <Grid item xs={6}>
                <Button
                  style={{ margin: 20 }}
                  variant="contained"
                  color="primary"
                  onClick={this.createTestCase}
                >
                  Create one!
                </Button>
              </Grid>
            </Grid>
          </div>
        ) : (
          <div>
            <Typography variant="h6" style={{ margin: 20 }} gutterBottom>
              Private Test cases of the exercise: {this.state.exerciseQuestion}
            </Typography>
            <Paper className={classes.root}>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell align="center" style={{ maxWidth: '2px' }}>
                      Test Case ID
                    </TableCell>
                    <TableCell align="center">Visibility</TableCell>
                    <TableCell align="center">Timeout (ms)</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.privateTestCases.map((testCase, index) => (
                    <TestCaseRow
                      key={index}
                      id={testCase.id}
                      visibility={testCase.visibility}
                      timeout={testCase.timeout}
                      inputs={testCase.inputs}
                      expectedOutputs={testCase.expectedOutputs}
                      deletePrivateTestCases={this.deletePrivateTestCases.bind(
                        this,
                        index
                      )}
                    />
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </div>
        )}
      </div>
    )
  }
}

ExerciseDashboard.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withSnackbar(withStyles(styles)(ExerciseDashboard))
