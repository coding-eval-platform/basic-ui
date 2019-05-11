import React from 'react';
import { Paper, withStyles, Grid, TextField, Button, FormControlLabel, Checkbox } from '@material-ui/core';
import { Face, Fingerprint } from '@material-ui/icons'

const styles = theme => ({
    margin: {
        margin: theme.spacing.unit * 2,
    },
    padding: {
        padding: theme.spacing.unit
    }
});

class LoginForm extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.margin}>
      {/* <Paper className={classes.padding}> */}

          {/* Username */}
          <Grid container spacing={8} alignItems="flex-end">
            <Grid item>
                <Face />
            </Grid>
            <Grid item md={true} sm={true} xs={true}>
                <TextField id="username" label="Username" type="email" fullWidth autoFocus required />
            </Grid>
          </Grid>

          {/* Password */}
          <Grid container spacing={8} alignItems="flex-end">
            <Grid item>
                <Fingerprint />
            </Grid>
            <Grid item md={true} sm={true} xs={true}>
                <TextField id="password" label="Password" type="password" fullWidth required />
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
              <Button variant="outlined" color="primary" style={{ textTransform: "none" }}>Login</Button>
          </Grid>

      {/* </Paper> */}
      </div>
    );
  }
}

export default withStyles(styles)(LoginForm);