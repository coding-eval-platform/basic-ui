// src/components/ExerciseInputs.js
import React from "react"
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import TestCaseDialog from './TestCaseDialog'



const ExerciseInputs = (props) => {
  return (
    props.exercises.map((val, idx)=> {
      let exerciseId = `exercise-${idx}`
      
      return (
        <div key={idx}>
          <Grid container spacing={24}>
            <Grid item xs={8}>
              <TextField
                id="filled-full-width"
                label={`Ejercicio #${idx + 1}`}
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
                <TestCaseDialog/>
            </Grid>

          </Grid>
        </div>
      )
    })
  )
}
export default ExerciseInputs