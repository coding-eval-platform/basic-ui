import React, { Component } from 'react';
import dynamic from 'next/dynamic'
const CodeEditor = dynamic(import('./codeEditor'), {ssr: false})

import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from '@material-ui/core/Button'
import SendIcon from '@material-ui/icons/Send';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
	},
	textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
});


function Exercise(props) {
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
					style ={{width: '100%'}}
        />

  	  <CodeEditor/>
		
			<Button variant="contained" color="primary" className={classes.button}>
				Execute code inside editor
        {/* This Button uses a Font Icon, see the installation instructions in the docs. */}
        <SendIcon className={classes.rightIcon} />
      </Button>
	</div>
	);
}


Exercise.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Exercise);
