import { Interpreter } from '../../Interpreter';

export function interpret(code) {
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

  return (new Interpreter(code, {stdout, stderr})).interpret();
}
