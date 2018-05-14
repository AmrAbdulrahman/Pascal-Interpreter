import React, { Component } from 'react';
import PropTypes from 'prop-types';

import CodeMirror from 'react-codemirror';

import 'codemirror/addon/selection/mark-selection';

import '../../../node_modules/codemirror/lib/codemirror.css';
import './styles.css';

import './syntax-highlighting';
import './syntax-highlighting.css';

class Editor extends Component {
  constructor() {
    super();

    this.currentTextMark = null;
  }

  componentDidMount() {
    this.codeMirrorInstance = this.codeMirrorRef.getCodeMirror();
  }

  componentWillUpdate({ markText }) {
    if (!markText) {
      if (this.currentTextMark) {
        this.currentTextMark.clear();
      }

      return;
    }

    const from = {
      line: markText.from.row,
      ch: markText.from.col,
    };

    const to = {
      line: markText.to.row,
      ch: markText.to.col,
    };

    this.setSelection(from, to);
  }

  setSelection(from, to) {
    if (this.currentTextMark) {
      this.currentTextMark.clear();
    }

    const className = 'simple-code-marked-text';

    this.currentTextMark = this.codeMirrorInstance.doc
      .markText(from, to, {className});
  }

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
        options={options}
        ref={elem => this.codeMirrorRef = elem} />
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
