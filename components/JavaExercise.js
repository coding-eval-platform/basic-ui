import React, { Component } from 'react';
import dynamic from 'next/dynamic'
const JavaEditor = dynamic(import('./JavaEditor'), {ssr: false})

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


function JavaExercise(props) {
	const { classes } = props;
	
	return (
		<div>

			{/* <TextField
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
			/>*/}

			<Grid container spacing={12}>
				<Grid item xs={6}>
  	  		<JavaEditor/>
				</Grid>

				<Grid item xs={6}>
					<TextField
						id="outlined-full-width"
						label="Ouput of the Java editor"
						style={{ margin: 8 }}
						multiline
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

				<Grid item xs={3}>
					<Button variant="contained" color="primary" className={classes.button}>
						Execute code inside editor
        		<SendIcon className={classes.rightIcon} />
      		</Button>
				</Grid>
				<Grid item xs={3}>
					<Button variant="contained" size="small" className={classes.button}>
    		    Submit my answer
        		<SaveIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
      		</Button>
				</Grid>

				
			</Grid>
	</div>
	);
}

JavaExercise.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(JavaExercise);
