import React, { Component } from 'react';
import './Output.css';

class Output extends Component {
  renderOutputRecord(record, index) {
    return (
      <div key={index} className={record.err ? 'Error' : 'Info'}>&gt;&nbsp;{record.out || record.err}</div>
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

export default Output;
