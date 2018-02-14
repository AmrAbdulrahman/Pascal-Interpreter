const { describe, it } = require('mocha');
const chai = require('chai');
const Lexer = require('./src/Lexer');
const { Parser } = require('./src/Parser');
const Interpreter = require('./src/Interpreter');
const expect = chai.expect;
const fs = require('fs');

chai.should();

function interpret(code) {
  const lexer = new Lexer(code);
  const parser = new Parser(lexer);
  const interpreter = new Interpreter(parser);

  return interpreter.interpret();
}

describe('Interpreter', () => {
  it('interprets simple pascal program', () => {
    const sourceCode = fs
      .readFileSync('./test.program.pc')
      .toString();

    interpret(sourceCode).should.equal(7);
  });
});
