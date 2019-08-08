import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import RenderButton from './RenderButton';


const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

function Header(props) {
  const { classes } = props;
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="inherit" className={classes.grow}>
            Coding Evaluation Platform
          </Typography>
          <RenderButton href='/' content='Home'/>
          {/* <RenderButton href='/about' content='About'/> */}
          <RenderButton href='/signup' content='Sign Up'/>
          <RenderButton href='/login' content='Login'/>
          <RenderButton href='/playground' content='Playground'/>
          <RenderButton href='/teacher_dashboard' content='Teacher'/>
          {/* <RenderButton href='/create_exam' content='Create Exam'/> */}
          {/* <RenderButton href='/create_exercises' content='Create Exercises'/> */}
        </Toolbar>
      </AppBar>
    </div>
  );
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Header);
