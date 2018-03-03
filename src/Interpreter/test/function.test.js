import { interpret } from './common/interpret';

describe('Interpreter:Function', () => {
  it('function without parenthes', () => {
    const retuenValue = interpret(`
      function whateverPlusOne takes n {
        return n + 1
      }

      return whateverPlusOne(1 + 1)
    `);

    expect(retuenValue).toEqual(3);
  });

  it('function with parenthes', () => {
    const retuenValue = interpret(`
      function whateverPlusOne takes (n) {
        return n + 1
      }

      return whateverPlusOne(1 + 1)
    `);

    expect(retuenValue).toEqual(3);
  });

  it('function with multiple parenthes', () => {
    const retuenValue = interpret(`
      function sum takes a, b {
        return a + b
      }

      return sum(2, 3)
    `);

    expect(retuenValue).toEqual(5);
  });

  it('recursion', () => {
    const retuenValue = interpret(`
      function factorial takes n { // function scope
        if n equals 0 or n equals 1 then return 1
        otherwise { // open block scope
          create x = n
          print('x before => ', x)

          // 1. keep block scope on hold which has 'x'
          // 2. switch to 'factorial' scope
          // 3. execute factorial body which recursively open new block scopes
          // 4. restore the block scope
          create nextCallValue = factorial(x - 1)

          print('x after => ', x)

          return x * nextCallValue
        }
      }

      return factorial(5)
    `);

    expect(retuenValue).toEqual(120);
  });

  it('function calls function', () => {
    const retuenValue = interpret(`
      function factorial takes n {
        if n equals 0 or n equals 1 then return 1
        otherwise return n * factorial(n - 1)
      }

      function factorialWrapper takes n {
        return factorial(n)
      }

      return factorialWrapper(5)
    `);

    expect(retuenValue).toEqual(120);
  });
});
