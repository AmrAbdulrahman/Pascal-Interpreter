/*
program : compound_statement DOT

compound_statement : BEGIN statement_list END

statement_list : statement
               | statement SEMI statement_list

statement : compound_statement
          | assignment_statement
          | empty

assignment_statement : variable ASSIGN expr

empty :

expr: term ((PLUS | MINUS) term)*

term: factor ((MUL | DIV) factor)*

factor : PLUS factor
       | MINUS factor
       | INTEGER
       | LPAREN expr RPAREN
       | variable

variable: ID
*/

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
  Compound,
  NoOp,
  Var,
  Assign,
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

  program() {
    // program : compound_statement DOT
    const compoundStatementNode = this.compound_statement();
    this.eat(DOT);
    return compoundStatementNode;
  }

  compound_statement() {
    // compound_statement : BEGIN statement_list END

    this.eat(BEGIN);
    const nodes = this.statement_list();
    this.eat(END);

    const compoundNode = new Compound();
    nodes.forEach(node => compoundNode.children.push(node))

    return compoundNode;
  }

  statement_list() {
    // statement_list : statement | statement SEMI statement_list
    const nodes = [this.statement()];

    while (this.currentToken.is(SEMI)) {
      this.eat(SEMI);
      nodes.push(this.statement());
    }

    return nodes;
  }

  statement() {
    // statement : compound_statement | assignment_statement | empty
    if (this.currentToken.is(BEGIN)) {
      return this.compound_statement();
    }

    if (this.currentToken.is(ID)) {
      return this.assignment_statement();
    }

    return this.empty();
  }

  assignment_statement() {
    // assignment_statement : variable ASSIGN expr
    const leftNode = this.variable();
    const operatorNode = this.operator(ASSIGN);
    const rightNode = this.expr();
    return new Assign(leftNode, operatorNode, rightNode);
  }

  expr() {
    // EXPR : TERM ((PLUS | MINUS) TERM)*
    let node = this.term();

    while (this.currentToken.is(PLUS, MINUS)) {
      let operator = this.operator(PLUS, MINUS);
      let rightNode = this.term();

      node = new BinOp(node, operator, rightNode);
    }

    return node;
  }

  term() {
    // TERM : FACTOR ((MUL | DIV) FACTOR)*
    let node = this.factor();

    while (this.currentToken.is(MULTIPLY, DIVISION)) {
      let operator = this.operator(MULTIPLY, DIVISION);
      let rightNode = this.factor();

      node = new BinOp(node, operator, rightNode);
    }

    return node;
  }

  factor() {
    // FACTOR : (PLUS | MINUS) FACTOR | INTEGER | OPENBRACE EXPR CLOSEBRACE | Variable
    const token = this.currentToken;

    // +factor
    if (this.currentToken.is(PLUS)) {
      this.eat(PLUS);
      return new UnaryOp(token, this.factor());
    }

    // -factor
    if (this.currentToken.is(MINUS)) {
      this.eat(MINUS);
      return new UnaryOp(token, this.factor());
    }

    // expr
    if (this.currentToken.is(OPENBRACE)) {
       this.eat(OPENBRACE);
       const exprNode = this.expr();
       this.eat(CLOSEBRACE);
       return exprNode;
    }

    // INTEGER
    if (this.currentToken.is(INTEGER)) {
      this.eat(INTEGER);
      return new Num(token);
    }

    return this.variable();
  }


  variable() {
    // variable: ID
    const variableNode = new Var(this.currentToken);
    this.eat(ID);
    return variableNode;
  }

  empty() {
    // empty:
    return new NoOp();
  }

  operator(...types) {
    const operatorToken = this.currentToken;
    this.eat(...types);
    return operatorToken;
  }

  parseProgram() {
    const ast = this.program();

    if (this.lexer.getNextToken().type !== EOF) {
      this.fail();
    }

    return ast;
  }

  parseExpr() {
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
