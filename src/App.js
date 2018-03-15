import React, { Component } from 'react';
import * as Icon from 'react-fontawesome';

import './App.css';

import Editor from './Components/Editor/Editor';
import Output from './Components/Output/Output';
import sampleCode from './Components/Editor/sample';
import { Interpreter, StepByStep } from './Interpreter';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      code: sampleCode,
      output: [],
      stepByStepMode: false,
    };
  }

  componentDidMount() {
    setTimeout(() => this.run());
  }

  writeOutput(message) {
    this.setState({
      output: [...this.state.output, { message }],
    });
  }

  writeError(error) {
    this.setState({
      output: [...this.state.output, { error }],
    });
  }

  clearOutputLogs() {
    this.setState({
      output: [],
    });
  }

  run() {
    this.clearOutputLogs();

    this.interpreter = new Interpreter(this.state.code);

    this.interpreter.on.output(msg => this.writeOutput(msg));
    this.interpreter.on.error(err => this.writeError(err));

    setTimeout(() => this.interpreter.interpret());
  }

  stepByStep() {
    this.clearOutputLogs();

    this.stepper = new StepByStep(this.state.code);

    this.stepper.on.error(err => {
      this.setState({
        stepByStepMode: false,
        error: err,
      });
    });

    this.stepper.on.step(step => {
      this.writeOutput(step.message);
      this.setState({
        markText: {
          from: step.node.from,
          to: step.node.to,
        },
      });
    });

    this.stepper.on.output(msg => this.writeOutput(msg));

    this.stepper.on.finish(() => {
      this.setState({
        stepByStepMode: false,
        markText: null,
      });
    });

    this.setState({
      stepByStepMode: true,
    });

    // don't block React Life Cycle
    setTimeout(() => this.stepper.start());
  }

  next() {
    this.stepper.actions.next();
  }

  stop() {
    this.stepper.actions.stop();
  }

  ['continue']() {
    this.stepper.actions.continue();
  }

  onCodeChange(code) {
    this.setState({
      code,
    });
  }

  onCursorActivity(e) {
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Simple Code</h1>
        </header>

        <div className="Content-Wrapper">
          <div className="EditorWrapper">
            <Editor
              value={this.state.code}
              markText={this.state.markText}
              onChange={e => this.onCodeChange(e)}
              onCursorActivity={e => this.onCursorActivity(e)}/>
          </div>
          <div className="OutputWrapper">
            {
              !this.state.stepByStepMode
              ?
              <div className="Actions">
                <button onClick={() => this.run()} className="Run Button">
                  <Icon name="play" /> Run
                </button>
                <button onClick={() => this.stepByStep()} className="StepByStep Button">
                  <Icon name="step-forward" /> Step by Step
                </button>
                <button onClick={() => this.clearOutputLogs()} className="ClearLogs Button OnlyIcon">
                  <Icon name="ban" />
                </button>
              </div>
              :
              <div className="Actions">
                <button onClick={() => this.stop()} className="Stop Button">
                  <Icon name="stop" />Stop
                </button>
                <button onClick={() => this.next()} className="Next Button">
                  <Icon name="step-forward" /> Next
                </button>
                <button onClick={() => this.continue()} className="Continue Button">
                  <Icon name="play" /> Continue
                </button>
                <button onClick={() => this.clearOutputLogs()} className="ClearLogs Button OnlyIcon">
                  <Icon name="ban" />
                </button>
              </div>
            }

            <Output records={this.state.output} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
