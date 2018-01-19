const readline = require('readline');

const INTEGER = 'INTEGER';
const PLUS = 'PLUS';
const MINUS = 'MINUS';
const MULTIPLY = 'MULTIPLY';
const DIVISION = 'DIVISION';
const MODULAR = 'MODULAR';
const EOF = 'EOF';
const SPACE = ' ';

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

class Interpreter {
  constructor(text) {
    this.text = text;
    this.pos = 0;
    this.currentToken = null;
    this.currentChar = this.text[this.pos];
  }

  fail() {
    throw new Error(`Error parsing ${this.text}`);
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

    while (Interpreter.isDigit(this.currentChar) === true) {
      numberStr += this.currentChar;
      this.advance();
    }

    return parseInt(numberStr);
  }

  getNextToken() {
    while (this.currentChar !== null) {
      if (this.currentCharIsSpace()) {
        this.skipWhiteSpace();
        continue;
      }

      if (this.currentCharIsDigit()) {
        return new Token(INTEGER, this.readNumber());
      }

      if (this.currentCharIsArithmeticOperator()) {
        const TYPE = this.getCurrentArithmeticOperatorType();
        this.advance();
        return new Token(TYPE, this.currentChar);
      }

      this.fail();
    }

    return new Token(EOF, null);
  }

  eat(TOKEN_TYPE) {
    TOKEN_TYPE = Array.isArray(TOKEN_TYPE) ? TOKEN_TYPE : [TOKEN_TYPE];

    if (TOKEN_TYPE.indexOf(this.currentToken.type) !== -1) {
      this.currentToken = this.getNextToken();
    } else {
      this.fail();
    }
  }

  expr() {
    this.currentToken = this.getNextToken();

    let exprValue = this.currentToken;
    this.eat(INTEGER);

    while (this.currentToken.type !== EOF) {
      let op = this.currentToken;
      this.eat([PLUS, MINUS, MULTIPLY, DIVISION, MODULAR]);

      let right = this.currentToken;
      this.eat(INTEGER);

      switch (op.type) {
        case PLUS:
          exprValue.value += right.value;
          break;
        case MINUS:
          exprValue.value -= right.value;
          break;
        case MULTIPLY:
          exprValue.value *= right.value;
          break;
        case DIVISION:
          exprValue.value /= right.value;
          break;
        case MODULAR:
          exprValue.value %= right.value;
          break;
        default: // unhandled arithmetic op
          this.fail();
      }
    }

    return exprValue.value;
  }

  currentCharIsDigit() {
    return Interpreter.isDigit(this.currentChar);
  }

  currentCharIsSpace() {
    return this.currentChar === SPACE;
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

  static isDigit(char) {
    return isNaN(parseInt(char)) === false;
  }
}

function ask() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('calc> ', (text) => {
    if (!text.trim().length) {
      rl.close();
      return ask();
    }

    let interpreter = new Interpreter(text);
    console.log(interpreter.expr());
    rl.close();
    ask();
  });
}

ask();
