const { parsed: localEnv } = require('dotenv').config()
const webpack = require('webpack')
const withProgressBar = require('next-progressbar')

module.exports = withProgressBar({
  // target: 'serverless',
  webpack(config) {
    config.plugins.push(new webpack.EnvironmentPlugin(localEnv))

    return config
  },

  progressBar: {
    profile: true
  }
})
