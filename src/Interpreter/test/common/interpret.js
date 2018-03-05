import { Interpreter } from '../../';

export async function interpret(code, options = {}) {
  const { stepByStep } = options;
  const stdout = {
    write(msg) {
      //console.log(msg);
    }
  };

  const stderr = {
    write(error) {
      throw error;
    }
  }

  return await (new Interpreter(code, {stdout, stderr, stepByStep})).interpret();
}
