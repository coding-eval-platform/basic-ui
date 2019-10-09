import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { withSnackbar } from 'notistack'
import dynamic from 'next/dynamic'
const RubyEditor = dynamic(import('../Editors/RubyEditor'), { ssr: false })
const CEditor = dynamic(import('../Editors/CEditor'), { ssr: false })
const JavaEditor = dynamic(import('../Editors/JavaEditor'), { ssr: false })

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

class CreateExercise extends React.Component {
  state = {
    examID: '',
    examDescription: '',
    question: '',
    language: '',
    solutionTemplate: '',
    awardedScore: ''
  }

  componentWillMount = async () => {
    const accessToken = await handleAccessToken()
  }

  onQuestionChange = question => {
    this.setState({ question: question.target.value })
  }

  onLanguageChange = language => {
    this.setState({ language: language.target.value })
  }

  onSolutionTemplateChange = solutionTemplate => {
    this.setState({ solutionTemplate })
  }

  onAwardedScoreChange = awardedScore => {
    this.setState({ awardedScore: awardedScore.target.value })
  }

  componentDidMount = () => {
    const examID = new URL(window.location.href).searchParams.get('examID')
    const examDescription = new URL(window.location.href).searchParams.get(
      'examDescription'
    )
    this.setState({
      examID: examID,
      examDescription: examDescription
    })
  }

  createExercise = () => {
    const url = `${process.env.API_HOST}/exams/${this.state.examID}/exercises`

    this.props.enqueueSnackbar('Creando el ejercicio', { variant: 'info' })
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + store.get('accessToken')
      },
      body: JSON.stringify({
        question: this.state.question,
        awardedScore: this.state.awardedScore,
        language: this.state.language,
        solutionTemplate: this.state.solutionTemplate
      })
    })
      .then(res => {
        console.log('Response status is: ', res.status)
        if (res.status === 201) {
          this.props.enqueueSnackbar('Ejercicio creado.', {
            variant: 'success'
          })
          let exercise_id = res.headers.get('Location').split('/')
          exercise_id = exercise_id[exercise_id.length - 1]

          // Router.push({
          //   pathname: `/exercise_dashboard`,
          //   query: {
          //     exerciseID: `${exercise_id}`,
          //     exerciseQuestion: `${this.state.question}`
          //   }
          // })
        } else if (res.status === 422) {
          this.props.enqueueSnackbar(
            'El examen debería estar en estado UPCOMING',
            {
              variant: 'warning'
            }
          )
        } else {
          this.props.enqueueSnackbar('Falló en crear el ejercicio.', {
            variant: 'error'
          })
        }
      })
      .catch(err => console.log(err))
  }

  render() {
    const { classes } = this.props

    return (
      <div>
        <Grid container spacing={24} alignItems="center">
          <Grid item xs={6}>
            <Button
              style={{ margin: 20 }}
              variant="outlined"
              color="primary"
              onClick={() => {
                Router.back()
              }}
            >
              Ir atrás
            </Button>
          </Grid>
        </Grid>
        <Typography style={{ margin: 20 }} variant="h5" gutterBottom>
          Crear un ejercicio para el examen: {this.state.examDescription}
        </Typography>
        <Grid container spacing={24} alignItems="center">
          <Grid item xs={6}>
            <TextField
              id="outlined-name"
              label="Consigna"
              placeholder="Ejemplo: Escribir una función que, dado un número entero, diga si es divisible por dos."
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
              label="Puntaje (entero)"
              placeholder="Ejemplo: 5"
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
              <InputLabel>Lenguaje</InputLabel>
              <Select
                value={this.state.language}
                onChange={this.onLanguageChange}
                style={{ minWidth: '10em' }}
              >
                <MenuItem value={'JAVA'}>Java</MenuItem>
                <MenuItem value={'RUBY'}>Ruby</MenuItem>
                <MenuItem value={'C'}>C</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        {this.state.language === '' ? (
          <div>
            <Typography style={{ margin: 20 }} variant="h6" gutterBottom>
              Elija un lenguaje por favor:
            </Typography>
          </div>
        ) : this.state.language === 'JAVA' ? (
          <div>
            <Typography style={{ margin: 20 }} variant="h6" gutterBottom>
              Inserte un template de solución:
            </Typography>
            <Grid
              container
              spacing={24}
              style={{ margin: 15 }}
              alignItems="center"
            >
              <Grid item xs={12} sm={6}>
                <JavaEditor
                  codeToRun={this.state.solutionTemplate}
                  onChange={this.onSolutionTemplateChange}
                />
              </Grid>
            </Grid>
            <Grid container spacing={24} alignItems="center">
              <Grid item xs={6}>
                <Button
                  style={{ margin: 20 }}
                  variant="contained"
                  color="primary"
                  onClick={this.createExercise}
                >
                  Crear ejercicio
                </Button>
              </Grid>
            </Grid>
          </div>
        ) : this.state.language === 'RUBY' ? (
          <div>
            <Typography style={{ margin: 20 }} variant="h6" gutterBottom>
              Inserte un template de solución:
            </Typography>
            <Grid
              container
              spacing={24}
              style={{ margin: 15 }}
              alignItems="center"
            >
              <Grid item xs={12} sm={6}>
                <RubyEditor
                  codeToRun={this.state.solutionTemplate}
                  onChange={this.onSolutionTemplateChange}
                />
              </Grid>
            </Grid>
            <Grid container spacing={24} alignItems="center">
              <Grid item xs={6}>
                <Button
                  style={{ margin: 20 }}
                  variant="contained"
                  color="primary"
                  onClick={this.createExercise}
                >
                  Crear ejercicio
                </Button>
              </Grid>
            </Grid>
          </div>
        ) : (
          <div>
            <Typography style={{ margin: 20 }} variant="h6" gutterBottom>
              Inserte un template de solución:
            </Typography>
            <Grid
              container
              spacing={24}
              style={{ margin: 15 }}
              alignItems="center"
            >
              <Grid item xs={12} sm={6}>
                <CEditor
                  codeToRun={this.state.solutionTemplate}
                  onChange={this.onSolutionTemplateChange}
                />
              </Grid>
            </Grid>
            <Grid container spacing={24} alignItems="center">
              <Grid item xs={6}>
                <Button
                  style={{ margin: 20 }}
                  variant="contained"
                  color="primary"
                  onClick={this.createExercise}
                >
                  Crear ejercicio
                </Button>
              </Grid>
            </Grid>
          </div>
        )}
      </div>
    )
  }
}

CreateExercise.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withSnackbar(withStyles(styles)(CreateExercise))
