const { describe, it } = require('mocha');
const chai = require('chai');
const Lexer = require('./src/Lexer');
const { Parser } = require('./src/Parser');
const Interpreter = require('./src/Interpreter');
const expect = chai.expect;

chai.should();

function interpret(text) {
  const lexer = new Lexer(text);
  const parser = new Parser(lexer);
  const interpreter = new Interpreter(parser);
  return interpreter.interpret();
}

describe('Interpreter', () => {
  it('simple case', () => {
    interpret('1+1').should.equal(2);
  });

  it('with spaces', () => {
    interpret(' 1 + 1 ').should.equal(2);
  });

  it('minus works', () => {
    interpret('5 - 3').should.equal(2);
  });

  it('more than two operands works', () => {
    interpret('5 - 3 + 1').should.equal(3);
  });

  it('multiply', () => {
    interpret('5 * 3').should.equal(15);
  });

  it('division', () => {
    interpret('20 / 4').should.equal(5);
  });

  it('mixed multiplication and division', () => {
    interpret('20 / 4 * 5').should.equal(25);
  });

  it('grouping works', () => {
    interpret('20 / (4 * 5)').should.equal(1);
  });

  it('grouping works', () => {
    let badGrouping = () => interpret('((4) * 5) (2)');
    expect(badGrouping).to.throw();
  });
});
