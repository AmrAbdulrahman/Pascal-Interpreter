const readline = require('readline');

const {
  INTEGER,
  PLUS,
  MINUS,
  MULTIPLY,
  DIVISION,
  MODULAR,
  EOF,
  SPACE,
  OPENBRACE,
  CLOSEBRACE } = require('./constants');

const Lexer = require('./Lexer');

class Interpreter {
  constructor(text) {
    this.lexer = new Lexer(text);
    this.currentToken = this.lexer.getNextToken();
  }

  fail() {
    throw new Error(`Invalid syntax`);
  }

  eat(...types) {
    if (types.indexOf(this.currentToken.type) !== -1) {
      this.currentToken = this.lexer.getNextToken();
    } else {
      this.fail();
    }
  }

  operator(...types) {
    const token = this.currentToken;
    this.eat(...types);
    return token;
  }

  factor() {
    const token = this.currentToken;
    this.eat(INTEGER);
    return token.value;
  }

  group() {
    // GROUP : FACTOR|OPENBRACE EXPR CLOSEBRACE

    if (this.currentTokenIs(OPENBRACE)) {
       this.eat(OPENBRACE);
       const result = this.expr();
       this.eat(CLOSEBRACE);
       return result;
    }

    return this.factor();
  }

  term() {
    // TERM : GROUP ((MUL|DIV)GROUP)*
    let result = this.group();

    while (this.currentTokenIs(MULTIPLY, DIVISION)) {
      let operator = this.operator(MULTIPLY, DIVISION);
      let rightGroup = this.group();

      switch (operator.type) {
        case MULTIPLY:
          result *= rightGroup;
          break;
        case DIVISION:
          result /= rightGroup;
          break;
        default: // unhandled arithmetic operator
          this.fail();
      }
    }

    return result;
  }

  // EXPR : TERM ((PLUS|MINUS)TERM)*
  expr() {
    let result = this.term();

    while (this.currentTokenIs(PLUS, MINUS)) {
      let operator = this.operator(PLUS, MINUS);
      let rightTerm = this.term();

      switch (operator.type) {
        case PLUS:
          result += rightTerm;
          break;
        case MINUS:
          result -= rightTerm;
          break;
        default: // unhandled arithmetic operator
          this.fail();
      }
    }

    return result;
  }

  run() {
    const value = this.expr();

    if (this.lexer.getNextToken().type !== EOF) {
      this.fail();
    }

    return value;
  }

  currentTokenIs(...types) {
    return types.indexOf(this.currentToken.type) !== -1;
  }
}

module.exports = Interpreter;
