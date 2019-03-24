// src/components/ExerciseInputs.js
import React from "react"
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';


const ExerciseInputs = (props) => {
  return (
    props.exercises.map((val, idx)=> {
      let exerciseId = `exercise-${idx}`
      
      return (
        <div key={idx}>
          <label htmlFor={exerciseId}>{`Ejercicio #${idx + 1}`}</label>
          <input
            type="text"
            value={props.exercises[idx].name} 
            className="name"
          />
        </div>
      )
    })
  )
}
export default ExerciseInputs