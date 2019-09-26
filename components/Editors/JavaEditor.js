import React, { Component } from 'react'
//import ReactAce from 'react-ace-editor';

import AceEditor from 'react-ace'
import 'brace/mode/java'
import 'brace/theme/monokai'
import 'brace/snippets/java'
import 'brace/ext/language_tools'

class JavaEditor extends Component {
  constructor(props) {
    super(props)
    this.onChange = this.onChange.bind(this)
  }

  onChange(newValue, e) {
    //console.log(newValue, e);
    const editor = this.ace.editor // The editor object is from Ace's API
    // console.log(editor.getValue()); // Outputs the value of the editor
    if (this.props.onChange) {
      this.props.onChange(editor.getValue())
    }
  }

  render() {
    return (
      <AceEditor
        mode="java"
        theme="monokai"
        name="editor1"
        value={this.props.codeToRun}
        onChange={this.onChange}
        setReadOnly={false}
        showGutter={true}
        showPrintMargin={true}
        highlightActiveLine={true}
        style={{ height: '845px', width: '95%' }}
        ref={instance => {
          this.ace = instance
        }} // Let's put things into scope
        editorProps={{ $blockScrolling: Infinity }}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
          showLineNumbers: true,
          tabSize: 2
        }}
      />
    )
  }
}
export default JavaEditor
