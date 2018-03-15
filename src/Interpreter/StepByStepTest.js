import { Interpreter } from './Interpreter';

const stdout = {
  write(...args) {
    console.log(...args);
  }
};

const stderr = {
  write(error) {
    console.log(error);
  }
}

const stdin = {
  on(event, handler) {
    process.stdin.setRawMode(true);
    process.stdin.once('data', data => {
      const char = data.toString();

      if (char === 'q') {
        process.exit();
      }

      process.stdin.setRawMode(false);
      (handler || function(){})(char);
    });
  }
}

const code = `
  function fib takes n {
    if n less than or equal 1 return 1
    otherwise return n * fib(n - 1)
  }

  return fib(3)
`;

process.on('SIGINT', () => {
  console.log('ctrl+C');
});


(async function run() {
  const res = await ((new Interpreter(code, {stdout, stderr, stdin, stepByStep: true})).interpret());

  process.exit();
})();
