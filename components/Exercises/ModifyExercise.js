import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'

import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import Button from '@material-ui/core/Button'
import Router from 'next/router'

import store from 'store'
import { handleAccessToken } from '../../auth'

const styles = theme => ({
  root: {
    flexGrow: 1,
    background: '#202020'
  },
  input: {
    color: 'white'
  },
  formControl: {
    margin: theme.spacing.unit,
    width: '100%',
    align: 'center'
  },
  button: {
    margin: theme.spacing.unit
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  }
})

class ModifyExercise extends React.Component {
  state = {
    exerciseID: '',
    question: '',
    language: '',
    solutionTemplate: '',
    awardedScore: ''
  }

  componentWillMount = async () => {
    const accessToken = await handleAccessToken()
    console.log('Access token is: ', store.get('accessToken'))
  }

  onQuestionChange = question => {
    this.setState({ question: question.target.value })
  }

  onLanguageChange = language => {
    this.setState({ language: language.target.value })
  }

  onSolutionTemplateChange = solutionTemplate => {
    this.setState({ solutionTemplate: solutionTemplate.target.value })
  }

  onAwardedScoreChange = awardedScore => {
    this.setState({ awardedScore: awardedScore.target.value })
  }

  componentDidMount = () => {
    const exerciseID = new URL(window.location.href).searchParams.get(
      'exerciseID'
    )

    this.setState({
      exerciseID: exerciseID
    })

    const url = `${process.env.API_HOST}/exercises/${exerciseID}`

    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + store.get('accessToken')
      }
    })
      .then(async res => {
        const examJSONResponse = await res.json()
        console.log('The exam to be updated is: ', examJSONResponse)

        this.setState({
          exerciseID: examJSONResponse.id,
          question: examJSONResponse.question,
          language: examJSONResponse.language,
          solutionTemplate: examJSONResponse.solutionTemplate,
          awardedScore: examJSONResponse.awardedScore
        })
      })
      .catch(err => console.log(err))
  }

  updateExercise = () => {
    console.log(
      'The UPDATED exercise is: ',
      JSON.stringify({
        question: this.state.question,
        awardedScore: this.state.awardedScore,
        language: this.state.language,
        solutionTemplate: this.state.solutionTemplate
      })
    )

    const url = `${process.env.API_HOST}/exercises/${this.state.exerciseID}`

    fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: this.state.question,
        awardedScore: this.state.awardedScore,
        language: this.state.language,
        solutionTemplate: this.state.solutionTemplate
      })
    })
      .then(res => {
        Router.push(`/teacher_dashboard`)
      })
      .catch(err => console.log(err))
  }

  render() {
    const { classes } = this.props

    return (
      <div>
        <Typography style={{ margin: 20 }} variant="h5" gutterBottom>
          Update the exercise: {this.state.question}
        </Typography>
        <Grid container spacing={24} alignItems="center">
          <Grid item xs={6}>
            <TextField
              id="outlined-name"
              label="Exercise question"
              placeholder="Example: Write a function that, given an integer number, indicates if it is divisible by two"
              style={{ margin: 20 }}
              onChange={this.onQuestionChange}
              value={this.state.question}
              fullWidth
              margin="normal"
              variant="outlined"
            />
          </Grid>
        </Grid>

        <Grid container spacing={24} alignItems="center">
          <Grid item xs={3}>
            <TextField
              id="outlined-name"
              label="Integer: awarded Score for this exercise"
              placeholder="Example: 5"
              style={{ margin: 20 }}
              onChange={this.onAwardedScoreChange}
              value={this.state.awardedScore}
              fullWidth
              margin="normal"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={3} style={{ margin: 20 }}>
            <FormControl>
              <InputLabel>Language</InputLabel>
              <Select
                value={this.state.language}
                onChange={this.onLanguageChange}
                style={{ minWidth: '10em' }}
                // inputProps={{
                //   name: "age",
                //   id: "age-simple"
                // }}
              >
                <MenuItem value={'JAVA'}>Java</MenuItem>
                <MenuItem value={'RUBY'}>Ruby</MenuItem>
                <MenuItem value={'C'}>C</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Typography style={{ margin: 20 }} variant="h6" gutterBottom>
          Insert a solution template below:
        </Typography>
        <Grid container spacing={24} alignItems="center">
          <Grid item xs={12} sm={6}>
            <TextField
              id="outlined-full-width"
              // label="Output of the Ruby editor"
              style={{ margin: 20 }}
              multiline
              rows="10"
              placeholder="public class Main {
public static void main(final String... args) {
\\\\ Write your code here...
}
}"
              onChange={this.onSolutionTemplateChange}
              value={this.state.solutionTemplate}
              fullWidth
              margin="normal"
              variant="outlined"
              InputLabelProps={{
                shrink: true
              }}
              className={classes.root}
              InputProps={{
                className: classes.input
              }}
            />
          </Grid>
        </Grid>

        {/* <Grid container spacing={24} alignItems="center"> */}
        {/* </Grid> */}
        <Grid container spacing={24} alignItems="center">
          <Grid item xs={6}>
            <Button
              style={{ margin: 20 }}
              variant="contained"
              color="primary"
              onClick={this.updateExercise}
            >
              Modify exercise
            </Button>
          </Grid>
        </Grid>
      </div>
    )
  }
}

ModifyExercise.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(ModifyExercise)
