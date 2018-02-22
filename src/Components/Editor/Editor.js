import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CodeMirror from 'react-codemirror';

import './mode';

import '../../../node_modules/codemirror/lib/codemirror.css';
import './Editor.css';
import './mode.css';

class Editor extends Component {
  render() {
    const options = {
			lineNumbers: true,
      mode: 'simple-code',
      tabSize: 2,
      indentWithTabs: false,
		};

    return (
      <CodeMirror
        value={this.props.value}
        onChange={e => this.props.onChange(e)}
        onCursorActivity={e => this.props.onCursorActivity(e)}
        options={options} />
    );
  }
}

Editor.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  onCursorActivity: PropTypes.func,
};

Editor.defaultProps = {
  value: '',
  onChange() {},
  onCursorActivity() {},
};

export default Editor;
