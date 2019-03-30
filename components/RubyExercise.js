import React, { Component } from 'react';
import dynamic from 'next/dynamic'
const RubyEditor = dynamic(import('./RubyEditor'), {ssr: false})

import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from '@material-ui/core/Button'
import SendIcon from '@material-ui/icons/Send';
import SaveIcon from '@material-ui/icons/Save';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
	},
	leftIcon: {
    marginRight: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
	},
	iconSmall: {
    fontSize: 20,
  },
	textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
});


function RubyExercise(props) {
	const { classes } = props;
	
	return (
		<div>

			<TextField
				id="outlined-multiline-static"
				label="Enunciado"
				multiline
				rows="4"
				defaultValue="Lorem ipsum dolor sit amet, 
				consectetur adipiscing elit, sed do eiusmod tempor 
				incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
				quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
				className={classes.textField}
				margin="normal"
				variant="outlined"
				InputProps={{
					readOnly: true,
				}}
				style ={{width: '100%'}}
        />

  	  <RubyEditor/>
		
			<Button variant="contained" color="primary" className={classes.button}>
				Execute code inside editor
        <SendIcon className={classes.rightIcon} />
      </Button>

			<Button variant="contained" size="small" className={classes.button}>
        Submit my answer
        <SaveIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
      </Button>
	</div>
	);
}

RubyExercise.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RubyExercise);
