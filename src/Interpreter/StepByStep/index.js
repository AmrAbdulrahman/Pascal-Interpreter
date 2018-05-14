import { Interpreter } from '../Interpreter';
import { Step } from './Step';
import { Defer } from '../Common/Defer';

class StopDebugger {
  constructor() {
  }
}

export class StepByStep extends Interpreter {
  constructor(code) {
    super(code)

    this.stepByStep = true;
    this.stepperDefer = null;
  }

  // take control over the error method of the Interpreter
  // so that we can handle the 'StopDebugger'
  error(ex) {
    if (ex instanceof StopDebugger) {
      return true;
    }

    return super.error(ex);
  }

  get on() {
    return Object.assign({}, super.on, {
      step: listener => this.register('step', listener),
      finish: listener => this.register('finish', listener),
    });
  }

  get actions() {
    return {
      stop: () => this._stopStepper(),
      next: () => this._moveStepper(),
      continue: () => this._continueStepper(),
    };
  }

  _resolveStepperDefer() {
    if (!this.stepperDefer) {
      throw new Error(`There's no waiting to resolve at the moment`);
    }

    this.stepperDefer.resolve();
    this.stepperDefer = null;
  }

  _rejectStepperDefer(reason) {
    if (!this.stepperDefer) {
      throw new Error(`There's no stepper to exit at the moment`);
    }

    this.stepperDefer.reject(reason);
    this.stepperDefer = null;
  }

  _moveStepper() {
    this._resolveStepperDefer();
  }

  _stopStepper() {
    this.output('Exiting step by step...');
    this._rejectStepperDefer(new StopDebugger());
    this.finish('stop');
  }

  _continueStepper() {
    this.continued = true;
    this._resolveStepperDefer();
  }

  finish(event) {
    this.notify('finish', event);
  }

  step({message, node}) {
    if (this.stepperDefer) {
      throw new Error(`Two methods can't wait asyncrounsly`);
    }

    if (this.continued) {
      return Promise.resolve();
    }

    this.stepperDefer = new Defer();

    const stepObject = new Step({
      scope: this.currentScope,
      node,
      message,
    });

    this.notify('step', stepObject);

    return this.stepperDefer.promise;
  }

  async start() {
    await this.interpret();
    this.output('Completed!');
    this.finish('end');
  }
}
