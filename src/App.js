import React, { Component } from 'react';
import './App.css';

import Editor from './Components/Editor/Editor';
import Output from './Components/Output/Output';
import sampleCode from './Components/Editor/sample';
import { Interpreter } from './Interpreter';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      code: sampleCode,
      output: [],
    };
  }

  componentDidMount() {
    setTimeout(() => this.run());
  }

  writeOutput(record) {
    this.setState({
      output: [...this.state.output, {out: record.toString()}],
    });
  }

  writeError(record) {
    this.setState({
      output: [...this.state.output, {err: record.toString()}],
    });
  }

  clearOutputLogs() {
    this.setState({
      output: [],
    });
  }

  run() {
    this.clearOutputLogs();

    const stdin = {};
    const stdout = {
      write: record => setTimeout(() => this.writeOutput(record)),
    };
    const stderr = {
      write: record => setTimeout(() => this.writeError(record)),
    };

    (new Interpreter(this.state.code, {stdin, stdout, stderr})).interpret();
  }

  onCodeChange(code) {
    this.setState({
      code,
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Simple Code</h1>
        </header>

        <div className="Content-Wrapper">
          <div className="EditorWrapper">
            <Editor value={this.state.code} onChange={(e) => this.onCodeChange(e)}/>
          </div>
          <div className="OutputWrapper">
            <div className="Actions">
              <button onClick={() => this.run()} className="RunButton">Run</button>
            </div>
            <Output records={this.state.output} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
