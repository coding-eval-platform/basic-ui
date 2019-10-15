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
import Modal from 'react-awesome-modal'
import { withSnackbar } from 'notistack'

import SubmitterRow from './SubmitterRow.js'

import store from 'store'
import { handleAccessToken } from '../../../auth'

const styles = theme => ({
  root: {
    width: '60%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto'
  }
})

class UsersDashboard extends React.Component {
  state = {
    submitters: [],
    isLoaded: false,
    // visibleDelete: false,
    index: ''
  }

  componentWillMount = async () => {
    const accessToken = await handleAccessToken()
  }

  componentDidMount = () => {
    const examID = new URL(window.location.href).searchParams.get('examID')
    const url = `${process.env.API_HOST}/exams/${examID}/solutions-submissions`

    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + store.get('accessToken')
      }
    })
      .then(async res => {
        const outputJSONResponse = await res.json()

        this.setState({
          isLoaded: true,
          submitters: outputJSONResponse
        })
      })
      .catch(err => console.log(err))
  }

  // createUser = () => {
  //   Router.push(`/create_user`);
  // };

  // deleteUser = index => {
  //   this.props.enqueueSnackbar(
  //     `Eliminando ${this.state.users[index].username}`,
  //     {
  //       variant: "info"
  //     }
  //   );

  //   const url = `${process.env.API_HOST}/users/${this.state.users[index].username}`;

  //   fetch(url, {
  //     method: "DELETE",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: "Bearer " + store.get("accessToken")
  //     },
  //     body: JSON.stringify({
  //       username: this.state.users[index].username
  //     })
  //   })
  //     .then(res => {
  //       // console.log('Response status is: ', res.status)
  //       if (res.status === 204) {
  //         this.props.enqueueSnackbar(
  //           `${this.state.users[index].username} eliminado`,
  //           { variant: "success" }
  //         );

  //         // Removes the desired item.
  //         this.state.users.splice(index, 1);
  //         this.setState({ users: this.state.users });
  //       } else {
  //         this.props.enqueueSnackbar("Falló eliminar el usuario.", {
  //           variant: "error"
  //         });
  //       }
  //     })
  //     .catch(err => console.log(err));
  // };

  openDeleteModal = index => {
    this.setState({
      visibleDelete: true,
      index: index
    })
  }

  closeDeleteModal() {
    this.setState({
      visibleDelete: false,
      index: ''
    })
  }

  render() {
    const { classes } = this.props
    if (!this.state.isLoaded) {
      return <div>Cargando...</div>
    } else if (this.state.submitters < 1) {
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
          <Typography variant="h6" style={{ margin: 20 }} gutterBottom>
            No tiene alumnos registrados en el examen aún 🤷‍♂️
          </Typography>
        </div>
      )
    } else {
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
          {/* <Grid container spacing={24} alignItems="center">
            <Grid item xs={6}>
              <Button
                style={{ margin: 20 }}
                variant="contained"
                color="primary"
                onClick={this.createUser}
              >
                Crear usuario
              </Button>
            </Grid>
          </Grid> */}
          <Typography variant="h6" style={{ margin: 20 }} gutterBottom>
            Los alumnos registrados son:
          </Typography>
          <Paper style={{ margin: 20 }} className={classes.root}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell align="center" style={{ maxWidth: '2px' }}>
                    ID del alumno
                  </TableCell>
                  <TableCell align="center">Nombre del alumno</TableCell>
                  {/* <TableCell align="center">Language</TableCell>
                  <TableCell align="center">Awarded Score</TableCell> */}
                  <TableCell align="center">Puntaje</TableCell>
                </TableRow>
              </TableHead>
              <TableBody align="center">
                {this.state.submitters.map((submitter, index) => (
                  <SubmitterRow
                    key={index}
                    submitterID={submitter.id}
                    submitter={submitter.submitter}
                    score={submitter.score || '-'}
                    // deleteEvent={this.openDeleteModal.bind(this, index)}
                  />
                ))}
              </TableBody>
              {/* DELETE MODAL */}
              {/* <Modal
                visible={this.state.visibleDelete}
                width="400"
                height="200"
                effect="fadeInUp"
                onClickAway={() => this.closeDeleteModal()}
              >
                <Typography
                  variant="h5"
                  style={{ margin: "20px 0px 0px 20px" }}
                  gutterBottom
                >
                  Borrar usuario
                </Typography>
                <Typography
                  variant="body1"
                  style={{ margin: "20px" }}
                  gutterBottom
                >
                  Está seguro que desea eliminar este usuario? Click SI para
                  eliminarlo, click fuera del recuadro para no eliminarlo.
                </Typography>
                <Button
                  style={{ marginLeft: "20px" }}
                  variant="outlined"
                  color="secondary"
                  onClick={() => {
                    this.deleteUser(this.state.index);
                  }}
                >
                  Si, eliminar usuario
                </Button>
              </Modal> */}
            </Table>
          </Paper>
        </div>
      )
    }
  }
}

UsersDashboard.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withSnackbar(withStyles(styles)(UsersDashboard))
