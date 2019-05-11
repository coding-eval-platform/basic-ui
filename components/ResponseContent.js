import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';


var ResponseContent = React.createClass({

  getInitialState: function() {
    return {
      textFieldValue: ''
    };
  },

  _handleTextFieldChange: function(e) {
    this.setState({
      textFieldValue: e.target.value
    });
  },

  render: function() {
      return (
        <div>
          <TextField
            id="outlined-full-width"
            label="Ouput of the Ruby editor"
            style={{ margin: 8 }}
            multiline
            rows='18'
            value={this.state.textFieldValue}
            onChange={this._handleTextFieldChange}
            placeholder="You will see the output of the editor here..."
            //helperText="Full width!"
            fullWidth
            margin="normal"
            variant="outlined"
            InputLabelProps={{
                shrink: true,
            }}
      />
        </div>
      )
  }

});

/*
Now all you have to do in your _handleClick method 
is retrieve the values of all your inputs from this.state 
and send them to the server
*/