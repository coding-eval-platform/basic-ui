import React, { Component } from 'react';
import dynamic from 'next/dynamic'
const CodeEditor = dynamic(import('./codeEditor'), {ssr: false})
import Button from '@material-ui/core/Button'

const Exercise = () => (
  <div>
    <CodeEditor/>

		<Button variant="contained" color="primary">
			Execute code inside editor
		</Button>
  </div>
)

export default Exercise
