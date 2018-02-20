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

  return (new Interpreter(`program p { ${code} }`, {stdout, stderr})).interpret();
}


describe('Interpreter', () => {
  it('simple return statement works', () => {
    const retuenValue = interpretProgram('return 1 + 2');
    expect(retuenValue).toEqual(3);
  });

  it('procedure declaration and invokation', () => {
    const retuenValue = interpretProgram(`
      procedure simpleProcedure(n: integer) {
        return n + 1;
      }

      return simpleProcedure(1 + 1);
    `);

    expect(retuenValue).toEqual(3);
  });
});
