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
         var x, c, s, cs: real;

         procedure square(n : integer);
            var res : integer;
         begin
            res := n * n;
            return res;
         end;

         procedure cube(n : integer);
         begin
            return n * n * n;
         end;

         procedure compose(n : integer);
         begin
            return square(n) + cube(n);
         end;

      begin { Main }

        x := 2;
        c := cube(x);
        s := square(x);
        cs := compose(x);

      end.  { Main }
      `
    );
  });
});
