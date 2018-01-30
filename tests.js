const { describe, it } = require('mocha');
const chai = require('chai');
const Lexer = require('./src/Lexer');
const { Parser } = require('./src/Parser');
const Interpreter = require('./src/Interpreter');
const expect = chai.expect;

chai.should();

function interpret(code) {
  const lexer = new Lexer(code);
  const parser = new Parser(lexer);
  const interpreter = new Interpreter(parser);

  return interpreter.interpret();
}

describe('Interpreter', () => {
  it('interprets simple pascal program', () => {
    interpret(
      `
      PROGRAM Part11;
      VAR
         number : INTEGER;
         a, b   : INTEGER;
         y      : REAL;

      BEGIN {Part11}
         number := 2;
         a := number ;
         b := 10 * a + 10 * number DIV 4;
         y := 20 / 7 + 3.14
      END.  {Part11}
      `
    );
  });
});
