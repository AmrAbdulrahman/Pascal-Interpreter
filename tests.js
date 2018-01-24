const { describe, it } = require('mocha');
const chai = require('chai');
const Lexer = require('./src/Lexer');
const { Parser } = require('./src/Parser');
const Interpreter = require('./src/Interpreter');
const expect = chai.expect;

chai.should();

function getInterpreter(text) {
  const lexer = new Lexer(text);
  const parser = new Parser(lexer);
  return new Interpreter(parser);
}

function interpretExpr(text) {
  return getInterpreter(text).interpretExpr();
}

function interpretProgram(code) {
  return getInterpreter(code).interpretProgram();
}

describe('Interpreter', () => {
  it('simple case', () => {
    interpretExpr('1+1').should.equal(2);
  });

  it('with spaces', () => {
    interpretExpr(' 1 + 1 ').should.equal(2);
  });

  it('minus works', () => {
    interpretExpr('5 - 3').should.equal(2);
  });

  it('more than two operands works', () => {
    interpretExpr('5 - 3 + 1').should.equal(3);
  });

  it('multiply', () => {
    interpretExpr('5 * 3').should.equal(15);
  });

  it('division', () => {
    interpretExpr('20 / 4').should.equal(5);
  });

  it('mixed multiplication and division', () => {
    interpretExpr('20 / 4 * 5').should.equal(25);
  });

  it('grouping works', () => {
    interpretExpr('20 / (4 * 5)').should.equal(1);
  });

  it('grouping works', () => {
    let badGrouping = () => interpretExpr('((4) * 5) (2)');
    expect(badGrouping).to.throw();
  });

  it('unary operator', () => {
    interpretExpr('--1').should.equal(1);
    interpretExpr('+--+1').should.equal(1);
    interpretExpr('+-1').should.equal(-1);
    interpretExpr('-+-+-1').should.equal(-1);
    interpretExpr('--5').should.equal(5);
    interpretExpr('---5').should.equal(-5);

    interpretExpr('- 3').should.equal(-3);
    interpretExpr('+ 3').should.equal(3);
    interpretExpr('5 - - - + - 3').should.equal(8);
    interpretExpr('5 - - - + - (3 + 4) - +2').should.equal(10);
  });

  it('RPN', () => {
    const lexer = new Lexer('(5 + 3) * 12 / 3');
    const parser = new Parser(lexer);
    const interpreter = new Interpreter(parser);
    interpreter.printRPN().join(' ').should.equal('5 3 + 12 * 3 /');
  });

  it('LISP', () => {
    const lexer = new Lexer('2 + 3 * 5');
    const parser = new Parser(lexer);
    const interpreter = new Interpreter(parser);
    interpreter.printLISP().join(' ').should.equal('( + 2 ( * 3 5 ) )');
  });

  it('interprets simple program', () => {
    interpretProgram(
      `
      BEGIN
          BEGIN
              number := 2;
              a := number;
              b := 10 * a + 10 * number / 4;
              c := a - - b
          END;
          x := 11;
      END.
      `
    ).should.deep.equal({ number: 2, a: 2, b: 25, c: 27, x: 11 });
  });
});
