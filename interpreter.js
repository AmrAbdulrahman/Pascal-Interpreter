const readline = require('readline');

const INTEGER = 'INTEGER';
const PLUS = 'PLUS';
const MINUS = 'MINUS';
const MULTIPLY = 'MULTIPLY';
const DIVISION = 'DIVISION';
const MODULAR = 'MODULAR';
const EOF = 'EOF';
const SPACE = ' ';

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
      if (this.currentCharIsSpace()) {
        this.skipWhiteSpace();
        continue;
      }

      if (this.currentCharIsDigit()) {
        return new Token(INTEGER, this.readNumber());
      }

      if (this.currentCharIsArithmeticOperator()) {
        const TYPE = this.getCurrentArithmeticOperatorType();
        const operand = this.currentChar;
        this.advance();
        return new Token(TYPE, operand);
      }

      this.fail();
    }

    return new Token(EOF, null);
  }

  currentCharIsDigit() {
    return isDigit(this.currentChar);
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
}

class Interpreter {
  constructor(lexer) {
    this.lexer = lexer;
    this.currentToken = this.lexer.getNextToken();
  }

  fail() {
    throw new Error(`Invalid syntax`);
  }

  eat(TOKEN_TYPE) {
    TOKEN_TYPE = Array.isArray(TOKEN_TYPE) ? TOKEN_TYPE : [TOKEN_TYPE];

    if (TOKEN_TYPE.indexOf(this.currentToken.type) !== -1) {
      this.currentToken = this.lexer.getNextToken();
    } else {
      this.fail();
    }
  }

  factor() {
    const token = this.currentToken;
    this.eat(INTEGER);
    return token.value;
  }

  operand() {
    const token = this.currentToken;
    this.eat([PLUS, MINUS, MULTIPLY, DIVISION, MODULAR]);
    return token;
  }

  expr() {
    let result = this.factor();

    while (this.currentTokenIsArithmeticOperand()) {
      let operand = this.operand();
      let rightTerm = this.factor();

      switch (operand.type) {
        case PLUS:
          result += rightTerm;
          break;
        case MINUS:
          result -= rightTerm;
          break;
        case MULTIPLY:
          result *= rightTerm;
          break;
        case DIVISION:
          result /= rightTerm;
          break;
        case MODULAR:
          result %= rightTerm;
          break;
        default: // unhandled arithmetic operand
          this.fail();
      }
    }

    return result;
  }

  currentTokenIsArithmeticOperand() {
    return '+-*/%'.indexOf(this.currentToken.value) !== -1;
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

    let lexer = new Lexer(text);
    let interpreter = new Interpreter(lexer);
    console.log(interpreter.expr());
    rl.close();
    ask();
  });
}

ask();
