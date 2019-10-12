import Layout from '../../components/MyLayout.js'
import JavaPlaygroundExercise from '../../components/Editors/JavaPlaygroundExercise.js'

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'

import Typography from '@material-ui/core/Typography'

class JavaPlayground extends Component {
  state = {
    value: 'java'
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

          <JavaPlaygroundExercise />
        </Layout>
      </div>
    )
  }
}

export default JavaPlayground
