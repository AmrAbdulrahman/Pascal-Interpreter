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

class ASTNode {
  get name() {
    throw new Error('ASTNode must implement the name getter or property');
  }

  valueOf() {
    throw new Error('ASTNode must implement the valueOf method');
  }
}

class BinOp extends ASTNode {
  constructor(left, op, right) {
    super();

    if (!(left instanceof ASTNode) || !(right instanceof ASTNode)) {
      throw new Error('left and right nodes must be an AST instances');
    }

    this.left = left;
    this.right = right;
    this.token = this.op = op;
  }

  get name() {
    return 'BinOp';
  }

  valueOf() {
    return this.op.value;
  }
}

class Num extends ASTNode {
  constructor(token) {
    super();

    this.token = token;
    this.value = token.value;
  }

  get name() {
    return 'Num';
  }

  valueOf() {
    return this.value;
  }
}

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
    const token = this.currentToken;
    this.eat(INTEGER);
    return new Num(token);
  }

  group() {
    // GROUP : FACTOR | OPENBRACE EXPR CLOSEBRACE

    if (this.currentTokenIs(OPENBRACE)) {
       this.eat(OPENBRACE);
       const exprNode = this.expr();
       this.eat(CLOSEBRACE);
       return exprNode;
    }

    return this.factor();
  }

  term() {
    // TERM : GROUP ((MUL | DIV) GROUP)*
    let node = this.group();

    while (this.currentTokenIs(MULTIPLY, DIVISION)) {
      let operator = this.operator(MULTIPLY, DIVISION);
      let rightNode = this.group();

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
