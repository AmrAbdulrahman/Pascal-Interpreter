const {
  PROGRAM,
  INTEGER_CONST,
  REAL_CONST,
  PLUS,
  MINUS,
  MULTIPLY,
  INTEGER_DIVISION,
  FLOAT_DIVISION,
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
  VAR,
  COMMA,
  COLON,
  INTEGER,
  REAL,
  PROCEDURE,
  RETURN,
} = require('./constants');

const {
  Program,
  Block,
  BinOp,
  UnaryOp,
  Num,
  Compound,
  NoOp,
  Var,
  Assign,
  Type,
  VariableDeclaration,
  ProcedureDecl,
  ProcedureInvokation,
  Return,
} = require('./ASTNodes');

class Parser {
  constructor(lexer) {
    this.lexer = lexer;
    this.currentToken = lexer.getNextToken();
  }

  fail(err) {
    const row = this.currentToken.rowNumber;
    const col = this.currentToken.colNumber;

    throw new Error(`${row}:${col} Invalid syntax: ` + (err || 'unexpected token'));
  }

  eat(...types) {
    if (types.indexOf(this.currentToken.type) !== -1) {
      this.currentToken = this.lexer.getNextToken();
    } else {
      this.fail(`Expected ${types.join('|')}`);
    }
  }

  program() {
    // program : PROGRAM variable SEMI block DOT
    this.eat(PROGRAM);
    const programName = this.variable();
    this.eat(SEMI);
    const blockNode = this.block();
    this.eat(DOT);

    return new Program(programName, blockNode);
  }

  block() {
    // block : declarations compound_statement
    const declarations = this.declarations();
    const compound = this.compound_statement();

    return new Block(declarations, compound);
  }

  declarations() {
    // declarations : VAR (variable_declaration SEMI)+
    //              | (PROCEDURE id (LPAREN ParamList RPAREN)? SEMI block SEMI)*
    //              | empty


    const varNodes = [];
    const procedureNodes = [];

    while (this.currentToken.is(VAR, PROCEDURE)) {
      if (this.currentToken.is(VAR)) {
        this.eat(VAR);

        while (this.currentToken.is(ID)) {
          varNodes.push(this.variable_declaration());
          this.eat(SEMI);
        }

        continue;
      }

      if (this.currentToken.is(PROCEDURE)) {
        this.eat(PROCEDURE);
        const id = this.variable();
        let params = [];

        if (this.currentToken.is(SEMI)) {
          this.eat(SEMI);
        } else {
          this.eat(OPENBRACE);
          params = this.params_list();
          this.eat(CLOSEBRACE);
          this.eat(SEMI);
        }

        const block = this.block();
        this.eat(SEMI);
        procedureNodes.push(new ProcedureDecl(id, params, block));
      }
    }

    return [...varNodes, ...procedureNodes];
  }

  params_list() {
    // params_list : params
    //             | params SEMI params_list

    const params = [...this.params()];

    while (this.currentToken.is(SEMI)) {
      this.eat(SEMI);
      params = [...params, ...this.params()];
    }

    return params;
  }

  params() {
    // params : ID (COMMA ID)* COLON type
    return this.variable_declaration();
  }

  variable_declaration() {
    // variable_declaration : ID (COMMA ID)* COLON type
    const variables = [this.variable()];

    while (this.currentToken.is(COMMA)) {
      this.eat(COMMA);
      variables.push(this.variable());
    }

    this.eat(COLON);
    const typeNode = this.type_spec();

    return variables.map(variable => new VariableDeclaration(variable, typeNode));
  }

  type_spec() {
    const token = this.currentToken;

    if (this.currentToken.is(INTEGER)) {
      this.eat(INTEGER);
    } else {
      this.eat(REAL);
    }

    return new Type(token);
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
    // statement : compound_statement | assignment_statement | return_statement | empty
    if (this.currentToken.is(BEGIN)) {
      return this.compound_statement();
    }

    if (this.currentToken.is(ID)) {
      return this.assignment_statement();
    }

    if (this.currentToken.is(RETURN)) {
      return this.return_statement();
    }

    return this.empty();
  }

  // return_statement : RETURN expr
  return_statement() {
    this.eat(RETURN);
    return new Return(this.expr());
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

    while (this.currentToken.is(MULTIPLY, INTEGER_DIVISION, FLOAT_DIVISION)) {
      let operator = this.operator(MULTIPLY, INTEGER_DIVISION, FLOAT_DIVISION);
      let rightNode = this.factor();

      node = new BinOp(node, operator, rightNode);
    }

    return node;
  }

  factor() {
    // FACTOR : (PLUS | MINUS) FACTOR
    //        | INTEGER_CONST
    //        | REAL_CONST
    //        | OPENBRACE EXPR CLOSEBRACE
    //        | procedure_invocation
    //        | Variable
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
    if (this.currentToken.is(INTEGER_CONST, REAL_CONST)) {
      this.eat(INTEGER_CONST, REAL_CONST);
      return new Num(token);
    }

    // id => variable or procedure
    const idToken = this.currentToken;
    this.eat(ID);

    // procedure invokation
    if (this.currentToken.is(OPENBRACE)) {
      this.eat(OPENBRACE);

      const args = [];

      // (arg (comma arg)*)
      if (!this.currentToken.is(CLOSEBRACE)) {
        args.push(this.expr()); // first arg

        while (this.currentToken.is(COMMA)) {
          this.eat(COMMA);
          args.push(this.expr());
        }
      }

      this.eat(CLOSEBRACE);

      return new ProcedureInvokation(idToken, args);
    }

    return new Var(idToken);
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

  parse() {
    const ast = this.program();

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
