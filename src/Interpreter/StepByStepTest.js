//import { StepByStep } from './StepByStep';
import { Interpreter } from './Interpreter';

const stdout = {
  write(...args) {
    console.log.apply(console, args);
  }
};

const stderr = {
  write(error) {
    throw error;
  }
}

const stdin = {
  on(event, handler) {
    process.stdin.setRawMode(true);
    process.stdin.once('data', data => {
      process.stdin.setRawMode(false);
      (handler || function(){})(data);
    });
  }
}

const code = `
  create x = 1,
         y = x + 1

  function a {
  }

  return y
`;

(async function run() {
  const res = await ((new Interpreter(code, {stdout, stderr, stdin, stepByStep: true})).interpret());

  process.exit();
})();
