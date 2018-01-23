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
  CLOSEBRACE,
  BEGIN,
  END,
  DOT,
  ID,
  ASSIGN,
  SEMI,
  } = require('./constants');

const {
  BinOp,
  UnaryOp,
  Num,
} = require('./ASTNodes');

class Parser {
  constructor(lexer) {
    this.lexer = lexer;
    this.currentToken = lexer.getNextToken();
  }

  fail() {
    throw new Error('Invalid syntax');
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
    // FACTOR : (PLUS | MINUS) FACTOR | INTEGER | OPENBRACE EXPR CLOSEBRACE
    const token = this.currentToken;

    if (this.currentTokenIs(PLUS)) {
      this.eat(PLUS);
      return new UnaryOp(token, this.factor());
    }

    if (this.currentTokenIs(MINUS)) {
      this.eat(MINUS);
      return new UnaryOp(token, this.factor());
    }

    // (expr)
    if (this.currentTokenIs(OPENBRACE)) {
       this.eat(OPENBRACE);
       const exprNode = this.expr();
       this.eat(CLOSEBRACE);
       return exprNode;
    }

    // INTEGER
    this.eat(INTEGER);
    return new Num(token);
  }

  term() {
    // TERM : FACTOR ((MUL | DIV) FACTOR)*
    let node = this.factor();

    while (this.currentTokenIs(MULTIPLY, DIVISION)) {
      let operator = this.operator(MULTIPLY, DIVISION);
      let rightNode = this.factor();

      node = new BinOp(node, operator, rightNode);
    }

    return node;
  }

  expr() {
    // EXPR : TERM ((PLUS | MINUS) TERM)*
    let node = this.term();

    while (this.currentTokenIs(PLUS, MINUS)) {
      let operator = this.operator(PLUS, MINUS);
      let rightNode = this.term();

      node = new BinOp(node, operator, rightNode);
    }

    return node;
  }

  currentTokenIs(...types) {
    return types.indexOf(this.currentToken.type) !== -1;
  }

  parse() {
    const ast = this.expr();

    if (this.lexer.getNextToken().type !== EOF) {
      this.fail();
    }

    return ast;
  }
}

module.exports = {
  Parser,
  BinOp,
  Num,
};
