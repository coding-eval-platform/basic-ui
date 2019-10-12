import Layout from '../../components/MyLayout.js'
import Router from 'next/router'

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Typography from '@material-ui/core/Typography'

class Playground extends Component {
  state = {
    value: ''
  }

  handleRadioButton(value) {
    this.setState({
      value: value
    })
  }

  handleLanguageChange(value) {
    Router.push(`/playground/${value}`)
  }

  render() {
    return (
      <div>
        <Layout>
          <Typography style={{ margin: 8 }} variant="h5" gutterBottom>
            Elija un lenguaje: &nbsp;
            <input
              type="radio"
              checked={this.state.value === 'ruby'}
              onChange={() => this.handleLanguageChange('ruby')}
            />
            Ruby &nbsp;
            <input
              type="radio"
              checked={this.state.value === 'java'}
              onChange={() => this.handleLanguageChange('java')}
            />
            Java &nbsp;
            <input
              type="radio"
              checked={this.state.value === 'c'}
              onChange={() => this.handleLanguageChange('c')}
            />
            C
          </Typography>
        </Layout>
      </div>
    )
  }
}

export default Playground
