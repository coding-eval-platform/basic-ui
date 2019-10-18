import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'

import store from 'store'
import { handleAccessToken } from '../../auth'

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto'
  }
})

class ExamFinished extends React.Component {
  state = {
    examID: '',
    submissionID: '',
    examDescription: ''
  }

  componentDidMount = async () => {
    const accessToken = await handleAccessToken()

    const examID = new URL(window.location.href).searchParams.get('examID')
    const submissionID = new URL(window.location.href).searchParams.get(
      'submissionID'
    )
    const examDescription = new URL(window.location.href).searchParams.get(
      'examDescription'
    )

    this.setState({
      examID: examID,
      examDescription: examDescription,
      submissionID: submissionID
    })
  }

  render() {
    const { classes } = this.props

    return (
      <div>
        <Grid container spacing={24} alignItems="center">
          <Grid item xs={10}>
            <Typography
              variant="h2"
              align="center"
              style={{ margin: 20 }}
              gutterBottom
            >
              Examen entregado! 👏
            </Typography>
            <Typography
              variant="h3"
              align="center"
              style={{ margin: 20 }}
              gutterBottom
            >
              Examen: {this.state.examDescription}
            </Typography>
            <Typography
              variant="h4"
              align="center"
              style={{ margin: 20 }}
              gutterBottom
            >
              ID del examen: {this.state.examID}
            </Typography>
            <Typography
              variant="h4"
              align="center"
              style={{ margin: 20 }}
              gutterBottom
            >
              ID de la entrega: {this.state.submissionID}
            </Typography>
          </Grid>
        </Grid>
      </div>
    )
  }
}

ExamFinished.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(ExamFinished)
