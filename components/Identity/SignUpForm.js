import React from 'react'
import { withStyles, Grid, TextField, Button } from '@material-ui/core'
import { Face, Fingerprint } from '@material-ui/icons'
import Router from 'next/router'

import { handleAccessToken } from '../../auth'

const styles = theme => ({
  margin: {
    margin: theme.spacing.unit * 2
  },
  padding: {
    padding: theme.spacing.unit
  }
})

class SignUpForm extends React.Component {
  state = {
    username: '',
    password: '',
    password2: ''
  }

  onUsernameChange = username => {
    this.setState({ username: username.target.value })
  }

  onPasswordChange = password => {
    this.setState({ password: password.target.value })
  }

  onPassword2Change = password2 => {
    this.setState({ password2: password2.target.value })
  }

  createUser = async () => {
    console.log(
      'POST sent this: ',
      JSON.stringify({
        username: this.state.username,
        password: this.state.password,
        password2: this.state.password2
      })
    )

    const accessToken = await handleAccessToken()

    console.log('fruta: ', 'Bearer ' + accessToken)

    fetch(`${process.env.API_HOST}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password
      })
    })
      .then(res => {
        console.log('Response status is: ', res.status())
        // let exam_id = res.headers.get('Location').split('/')
        // exam_id = exam_id[exam_id.length - 1]
        // console.log('EXAM_ID IS: ', exam_id)
        // this.setState({
        //   exam_id
        // });
        // this.props.history.push(`/login`);
        Router.push(`/login`)
        // Router.push({
        //   pathname: `/login`,
        //   query: {
        //     examID: `${exam_id}`,
        //     examDescription: `${this.state.description}`
        //   }
        // })
      })
      .catch(err => console.log(err))
  }

  render() {
    const { classes } = this.props

    return (
      <div className={classes.margin}>
        {/* <Paper className={classes.padding}> */}
        {/* Username */}
        <Grid container spacing={8} alignItems="flex-end">
          <Grid item>
            <Face />
          </Grid>
          <Grid item md={true} sm={true} xs={true}>
            <TextField
              id="username"
              label="Username"
              type="email"
              value={this.state.username}
              onChange={this.onUsernameChange}
              fullWidth
              autoFocus
              required
            />
          </Grid>
        </Grid>

        {/* Password */}
        <Grid container spacing={8} alignItems="flex-end">
          <Grid item>
            <Fingerprint />
          </Grid>
          <Grid item md={true} sm={true} xs={true}>
            <TextField
              id="password"
              label="Password"
              type="password"
              value={this.state.password}
              onChange={this.onPasswordChange}
              fullWidth
              required
            />
          </Grid>
        </Grid>

        {/* Confirm Password */}
        <Grid container spacing={8} alignItems="flex-end">
          <Grid item>
            <Fingerprint />
          </Grid>
          <Grid item md={true} sm={true} xs={true}>
            <TextField
              id="password-confirmation"
              label="Re-enter password"
              type="password"
              value={this.state.password2}
              onChange={this.onPassword2Change}
              fullWidth
              required
            />
          </Grid>
        </Grid>

        {/* Remember me */}
        {/* 
          <Grid container alignItems="center" justify="space-between">
            <Grid item>
                <FormControlLabel control={
                    <Checkbox
                        color="primary"
                    />
                } label="Remember me" />
            </Grid>
            */}
        {/* Forgot password */}
        {/* 
            <Grid item>
                <Button disableFocusRipple disableRipple style={{ textTransform: "none" }} variant="text" color="primary">Forgot password ?</Button>
            </Grid>
            </Grid>
             */}
        <Grid container justify="center" style={{ marginTop: '10px' }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={this.createUser}
            style={{ textTransform: 'none' }}
          >
            Sign Up
          </Button>
        </Grid>

        {/* </Paper> */}
      </div>
    )
  }
}

export default withStyles(styles)(SignUpForm)
