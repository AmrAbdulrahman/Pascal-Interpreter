import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Editor.css';

class Editor extends Component {
  render() {
    return (
      <textarea className="Code-Editor" value={this.props.value} onChange={(e) => this.props.onChange(e)}></textarea>
    );
  }
}

Editor.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
};

Editor.defaultProps = {
  value: '',
  onChange() {},
};

export default Editor;
