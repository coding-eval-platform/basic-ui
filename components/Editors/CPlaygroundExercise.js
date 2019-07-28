import React, { Component } from 'react';
import dynamic from 'next/dynamic'
const CEditor = dynamic(import('./CEditor'), {ssr: false})

import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from '@material-ui/core/Button'
import SendIcon from '@material-ui/icons/Send';
import SaveIcon from '@material-ui/icons/Save';
import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
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


function CExercise(props) {
	const { classes } = props;
	
	return (
		<div>
			<Grid container spacing={24}>

        {/* C EDITOR */}
				<Grid item xs={6}>
  	  		<CEditor/>
				</Grid>

        {/* C OUPUT */}
				<Grid item xs={6}>
					<TextField
						id="outlined-full-width"
						label="Ouput of the Java editor"
						style={{ margin: 8 }}
						multiline
						rows='18'
						placeholder="You will see the output of the editor here..."
						//helperText="Full width!"
						fullWidth
						margin="normal"
						variant="outlined"
						InputLabelProps={{
							shrink: true,
						}}
					/>
				</Grid>

        {/* EXECUTES */}
				<Grid item xs={3}>
					<Button variant="contained" color="primary" className={classes.button}>
						Execute code inside editor
        		<SendIcon className={classes.rightIcon} />
      		</Button>
				</Grid>
				
			</Grid>
		</div>

	);
}

CExercise.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CExercise);
