import React from "react"
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

import TestCaseDialog from './TestCaseDialog'

const styles = theme => ({
  root: {
    display: 'flex',
  },
  formControl: {
    margin: theme.spacing.unit * 3,
  },
  group: {
    margin: `${theme.spacing.unit}px 0`,
  },
});


const ExerciseInputs = (props) => {

  const { classes } = props;

  return (
    props.exercises.map((val, idx) => {

      return (
        <div key={idx}>
          <Grid container spacing={24}>
            <Grid item xs={6}>
              <TextField
                id="filled-full-width"
                label={`Question #${idx + 1}`}
                placeholder="Insert the question description here."
                style={{ margin: 8 }}
                margin-top="normal"
                variant="filled"
                fullWidth
                multiline
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <FormControl component="fieldset" className={classes.formControl}>
                <FormLabel component="legend">Language</FormLabel>
                <RadioGroup 
                  row
                  aria-label="language"
                  name="language"
                  className={classes.group}
                // value={this.state.value}
                // onChange={this.handleChange}
                >
                  <FormControlLabel 
                    value="java" 
                    control={<Radio />} label="Java" />
                  <FormControlLabel 
                    value="ruby" 
                    control={<Radio />} label="Ruby" />
                  <FormControlLabel 
                    value="c" 
                    control={<Radio />} label="C" />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={2}>
              <TestCaseDialog />
            </Grid>

          </Grid>
        </div>
      )
    })
  )
}
export default withStyles(styles)(ExerciseInputs);