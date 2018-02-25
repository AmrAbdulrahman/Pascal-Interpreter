import { Interpreter } from './Interpreter';


function interpretProgram(code) {
  const stdout = {
    write() {}
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


  it('member access chain', () => {
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
});
