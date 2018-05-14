import React, { Component } from 'react';
import './styles.css';

class LogsView extends Component {
  getOutputString(record) {
    if (!record) {
      return '';
    }

    if (record.message) {
      return record.message.toString();
    }

    if (record.error) {
      return record.error.toString();
    }

    return '';
  }

  renderOutputRecord(record, index) {
    return (
      <div key={index} className={record.error ? 'Error' : 'Info'}>&gt;&nbsp;{this.getOutputString(record)}</div>
    );
  }

  render() {
    return (
      <div className="Output">
        {
          this.props.records.map((record, index) => this.renderOutputRecord(record, index))
        }
      </div>
    );
  }
}

export default LogsView;
