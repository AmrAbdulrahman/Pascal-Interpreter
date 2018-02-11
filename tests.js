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
      program Main;
         var x, y: real;

         procedure double(n : integer);
            var res : integer;
         begin
            res := n + n;
            { return res; }
         end;


      begin { Main }

      end.  { Main }
      `
    );
  });
});
