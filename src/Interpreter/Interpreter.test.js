import { Interpreter } from './Interpreter';


function interpretProgram(code) {
  const stdout = {
    write(msg) {
    //  console.log(msg);
    }
  };

  const stderr = {
    write(error) {
      throw error;
    }
  }

  return (new Interpreter(code, {stdout, stderr})).interpret();
}


describe('Interpreter', () => {
  it('simple return statement works', () => {
    const retuenValue = interpretProgram('return 1 + 2');
    expect(retuenValue).toEqual(3);
  });

  it('function declaration and invokation', () => {
    const retuenValue = interpretProgram(`
      function simpleProcedure takes (n) {
        return n + 1
      }

      return simpleProcedure(1 + 1)
    `);

    expect(retuenValue).toEqual(3);
  });

  it('member access chain', () => {
    const retuenValue = interpretProgram(`
      create a = {
        b: {
          c: {
            d: 1
          }
        }
      }

      return d of c of b of a
    `);

    expect(retuenValue).toEqual(1);
  });


  it('member access chain (of)', () => {
    const badCode = () => interpretProgram(`
      create a = {
        b: {
          c: {
            d: 1
          }
        }
      }

      return a of cc of b of a
    `);

    expect(badCode).toThrow(`object has no property`);
  });

  it('member access chain (dot)', () => {
    const returnValue = interpretProgram(`
      create a = {
        b: {
          c: {
            d: 1
          }
        }
      }

      return a.b.c.d
    `);

    expect(returnValue).toEqual(1);
  });

  it('mixed (of) and (dot)', () => {
    const returnValue = interpretProgram(`
      create a = {
        b: {
          c: {
            d: 'value'
          }
        }
      }

      create obj = {
        key: 2
      }

      return d of a.b.c
    `);

    expect(returnValue).toEqual('value');
  });

  it('member access chain', () => {
    const badCode = () => interpretProgram(`
      create a = ''
      return b of a
    `);

    expect(badCode).toThrow(`Can't call`);
  });

  it('member access chain', () => {
    const badCode = () => interpretProgram(`
      return b of a
    `);

    expect(badCode).toThrow(`Undeclared variable 'a'`);
  });

  it('recursion', () => {
    const retuenValue = interpretProgram(`
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

  it('recursion', () => {
    const retuenValue = interpretProgram(`
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
