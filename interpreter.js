const readline = require('readline');

const INTEGER = 'INTEGER';
const PLUS = 'PLUS';
const MINUS = 'MINUS';
const MULTIPLY = 'MULTIPLY';
const DIVISION = 'DIVISION';
const MODULAR = 'MODULAR';
const EOF = 'EOF';
const SPACE = ' ';
const OPENBRACE = 'OPENBRACE';
const CLOSEBRACE = 'CLOSEBRACE';

function isDigit(char) {
  return isNaN(parseInt(char)) === false;
}

class Token {
  constructor(type, value) {
    this.type = type;
    this.value = value;
  }

  toString() {
    return `Token(${this.type}, ${this.value})`;
  }

  repr() {
    return this.toString();
  }
}

class Lexer {
  constructor(text) {
    this.text = text;
    this.pos = 0;
    this.currentChar = this.text[this.pos];
  }

  fail() {
    throw new Error(`Invalid character`);
  }

  advance() {
    this.pos++;

    if (this.pos >= this.text.length) {
      this.currentChar = null;
    } else {
      this.currentChar = this.text[this.pos];
    }
  }

  skipWhiteSpace() {
    while (this.currentChar === SPACE) {
      this.advance();
    }
  }

  readNumber() {
    let numberStr = '';

    while (isDigit(this.currentChar) === true) {
      numberStr += this.currentChar;
      this.advance();
    }

    return parseInt(numberStr);
  }

  getNextToken() {
    while (this.currentChar !== null) {
      if (this.currentCharIs(SPACE)) {
        this.skipWhiteSpace();
        continue;
      }

      if (this.currentCharIsDigit()) {
        return new Token(INTEGER, this.readNumber());
      }

      if (this.currentCharIs('(')) {
        this.advance();
        return new Token(OPENBRACE, '(');
      }

      if (this.currentCharIs(')')) {
        this.advance();
        return new Token(CLOSEBRACE, ')');
      }

      if (this.currentCharIsArithmeticOperator()) {
        const TYPE = this.getCurrentArithmeticOperatorType();
        const operator = this.currentChar;
        this.advance();
        return new Token(TYPE, operator);
      }

      this.fail();
    }

    return new Token(EOF, null);
  }

  currentCharIsDigit() {
    return isDigit(this.currentChar);
  }

  currentCharIs(char) {
    return this.currentChar === char;
  }

  currentCharIsArithmeticOperator() {
    return '+-*/%'.indexOf(this.currentChar) !== -1;
  }

  getCurrentArithmeticOperatorType() {
    const types = {
      '+': PLUS,
      '-': MINUS,
      '*': MULTIPLY,
      '/': DIVISION,
      '%': MODULAR,
    };

    return types[this.currentChar];
  }
}

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
