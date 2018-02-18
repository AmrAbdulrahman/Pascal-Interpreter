const { concat, failPositionCodePreview, last, log } = require('./utils');
const Token = require('./Token');

const {
  PROGRAM,
  INTEGER_CONST,
  REAL_CONST,
  STRING_LITERAL,
  PLUS,
  MINUS,
  MULTIPLY,
  INTEGER_DIVISION,
  FLOAT_DIVISION,
  EOF,
  SPACE,
  OPENBRACE,
  CLOSEBRACE,
  OPEN_CURLY_BRACE,
  CLOSE_CURLY_BRACE,
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
  IF,
  ELSE,
  OTHERWISE,
  EQUALS,
  NOT,
  NOT_EQUALS,
} = require('./constants');

const {
  Program,
  Block,
  ScopedBlock,
  BinOp,
  UnaryOp,
  Num,
  NoOp,
  Var,
  Assign,
  Type,
  VariableDeclaration,
  ProcedureDecl,
  ProcedureInvokation,
  Return,
  Str,
  If,
  Condition,
} = require('./ASTNodes');

const TOKENS_IN_ADVANCE = 3;

class Parser {
  constructor(lexer) {
    this.lexer = lexer;
    this.tokens = [];

    this.currentToken = lexer.getNextToken();

    for (let i = 0; i < TOKENS_IN_ADVANCE; i++) {
      this.tokens.push(lexer.getNextToken());
    }
  }

  fail(err) {
    const row = this.currentToken.rowIndex;
    const col = this.currentToken.colIndex;
    const codePreview = failPositionCodePreview(row, col, this.lexer.text);

    throw new Error(`${codePreview}Invalid syntax: ` + (err || 'unexpected token'));
  }

  eat(...types) {
    this.validateCurrentToken(types);
  }

  eatOptional(...types) {
    if (this.currentToken.is(...types)) {
      this.eat(...types);
    }
  }

  validateCurrentToken(types, message) {
    if (types.indexOf(this.currentToken.type) !== -1) {
      this.currentToken = this.tokens.shift();
      this.tokens.push(this.lexer.getNextToken());
    } else {
      this.fail(`Expected ${types.join('|')} but found ${this.currentToken.type}`);
    }
  }

  insert(type) {
    this.tokens.unshift(this.currentToken); // bring current token back
    this.currentToken = new Token(type);
  }

  nextToken(n = 1) {
    if (n < 1 || n > this.tokens.length) {
      throw new Error(`Parser: next token number range [1, ${this.tokens.length}]`);
    }

    return this.tokens[n - 1];
  }

  program() {
    log('program');
    // program : PROGRAM variable block

    this.eat(PROGRAM);
    const programName = this.variable();
    const blockNode = this.scoped_block();

    return new Program(programName, blockNode);
  }

  // this is just a block, it does't open a new scope
  // it's useful as `function`, `while`, or `for` body
  block() {
    log('block');
    // block : OPEN_CURLY_BRACE block CLOSE_CURLY_BRACE

    this.eat(OPEN_CURLY_BRACE);
    const blockNode = new Block(this.statement_list());
    this.eat(CLOSE_CURLY_BRACE);
    return blockNode;
  }

  scoped_block() {
    // scoped_block : OPEN_CURLY_BRACE block CLOSE_CURLY_BRACE
    log('scoped_block');

    this.eat(OPEN_CURLY_BRACE);
    const scopedBlockNode = new ScopedBlock(this.statement_list());
    this.eat(CLOSE_CURLY_BRACE);
    return scopedBlockNode;
  }

  params_list() {
    log('params_list');
    // params_list : params (SEMI params)*

    let params = [...this.params()];

    while (this.currentToken.is(SEMI)) {
      this.eat(SEMI);
      concat(params, this.params());
    }

    return params;
  }

  params() {
    log('params');
    // params : variables_list COLON type

    const variables = this.variables_list();
    this.eat(COLON);
    const typeNode = this.type_spec();

    return variables.map(variable => new VariableDeclaration(variable, typeNode));
  }

  variables_declaration() {
    log('variables_declaration');
    // variable_declaration : VAR variables_list COLON type

    this.eat(VAR);
    const variables = this.variables_list();
    this.eat(COLON);
    const typeNode = this.type_spec();

    return variables.map(variable => new VariableDeclaration(variable, typeNode));
  }

  variables_list() {
    log('variables_list');
    // variables_list: ID (COMMA ID)*

    const variables = [this.variable()];

    while (this.currentToken.is(COMMA)) {
      this.eat(COMMA);
      variables.push(this.variable());
    }

    return variables;
  }

  procedure_declaration() {
    log('procedure_declaration');
    // procedure_declaration : PROCEDURE ID OPENBRACE params_list CLOSEBRACE block

    this.eat(PROCEDURE);
    const id = this.variable();
    let params = [];

    this.eat(OPENBRACE);

    if (!this.currentToken.is(CLOSEBRACE)) {
      params = this.params_list();
    }

    this.eat(CLOSEBRACE);

    const block = this.block();

    this.insert(SEMI); // auto insert SEMI after procedure declaration

    return new ProcedureDecl(id, params, block);
  }

  type_spec() {
    log('type_spec');
    const token = this.currentToken;

    if (this.currentToken.is(INTEGER)) {
      this.eat(INTEGER);
    } else {
      this.eat(REAL);
    }

    return new Type(token);
  }

  statement_list() {
    log('statement_list');
    // statement_list : statement (SEMI statement)*

    const nodes = [this.statement()];

    while (this.currentToken.is(SEMI)) {
      this.eat(SEMI);
      nodes.push(this.statement());
    }

    return nodes;
  }

  statement() {
    log('statement');
    // statement : assignment_statement
    //           | procedure_invocation
    //           | return_statement
    //           | if_block
    //           | var_declaration
    //           | procedure_declaration
    //           | empty

    if (this.currentToken.is(IF)) {
      return this.if_block();
    }

    if (this.currentToken.is(ID) && this.nextToken().is(OPENBRACE)) {
      return this.procedure_invocation();
    }

    if (this.currentToken.is(ID)) {
      return this.assignment_statement();
    }

    if (this.currentToken.is(RETURN)) {
      return this.return_statement();
    }

    if (this.currentToken.is(VAR)) {
      return this.variables_declaration();
    }

    if (this.currentToken.is(PROCEDURE)) {
      return this.procedure_declaration();
    }

    return this.empty();
  }

  if_block() {
    log('if_block');
    // if_block: if OPENBRACE condition CLOSEBRACE statement_or_block (ELSE IF condition statement_or_block)* (OTHERWISE statement_or_block)?

    const ifs = [];
    let condition = null;
    let body = null;
    let otherwise = null;

    this.eat(IF);
    this.eat(OPENBRACE);
    condition = this.condition();
    this.eat(CLOSEBRACE);
    body = this.statement_or_scoped_block();

    ifs.push({
      condition,
      body,
    });

    // else if*
    while (this.currentToken.is(ELSE) && this.nextToken().is(IF)) {
      this.eat(ELSE);
      this.eat(IF);
      this.eat(OPENBRACE);
      condition = this.condition();
      this.eat(CLOSEBRACE);
      body = this.statement_or_scoped_block();

      ifs.push({
        condition,
        body,
      });
    }

    if (this.currentToken.is(OTHERWISE)) {
      this.eat(OTHERWISE);
      otherwise = this.statement_or_scoped_block();
    }

    this.insert(SEMI); // auto insert SEMI after if statement

    return new If(ifs, otherwise);
  }

  statement_or_scoped_block() {
    log('statement_or_block');
    // statement_or_block : (statement SEMI?) | scoped_block

    if (this.currentToken.is(OPEN_CURLY_BRACE)) {
      return this.scoped_block();
    } else {
      const statement = this.statement();
      this.eatOptional(SEMI);
      return statement;
    }
  }

  condition() {
    log('condition');
    // condition: expr

    return new Condition(this.expr());
  }

  return_statement() {
    log('return_statement');
    // return_statement : RETURN expr

    this.eat(RETURN);
    return new Return(this.expr());
  }

  assignment_statement() {
    log('assignment_statement');
    // assignment_statement : variable ASSIGN expr

    const leftNode = this.variable();
    const operatorNode = this.operator(ASSIGN);
    const rightNode = this.expr();

    return new Assign(leftNode, operatorNode, rightNode);
  }

  get expr_precedence() {
    return [
      'expr',
      'expr_logical_equals',
      'expr_arithmetic_plus',
      'expr_arithmetic_multiply',
      'expr_factor',
    ];
  }

  nextExprMethodOf(name) {
    const currentMethodIndex = this.expr_precedence.indexOf(name);
    const nextExprMethodName = this.expr_precedence[currentMethodIndex + 1];
    return this[nextExprMethodName]();
  }

  expr() {
    return this.nextExprMethodOf('expr');
  }

  expr_logical_equals() {
    log('expr_logical_equals');
    // expr_logical_equals : ex (NOT? EQUALS expr1)*

    const MYSELF = 'expr_logical_equals';
    let left = this.nextExprMethodOf(MYSELF);

    while (this.currentToken.is(EQUALS) || this.currentToken.is(NOT)) {
      let operator;

      if (this.currentToken.is(EQUALS)) {
        operator = this.operator(EQUALS);
      } else {
        this.eat(NOT);
        this.eat(EQUALS);
        operator = new Token(NOT_EQUALS);
      }

      let right = this.nextExprMethodOf(MYSELF);

      left = new BinOp(left, operator, right);
    }

    return left;
  }

  expr_arithmetic_plus() {
    log('expr_arithmetic_plus');
    // expr1 : expr2 ((PLUS | MINUS) expr2)*

    const MYSELF = 'expr_arithmetic_plus';
    let left = this.nextExprMethodOf(MYSELF);

    while (this.currentToken.is(PLUS, MINUS)) {
      let operator = this.operator(PLUS, MINUS);
      let right = this.nextExprMethodOf(MYSELF);

      left = new BinOp(left, operator, right);
    }

    return left;
  }

  expr_arithmetic_multiply() {
    log('expr_arithmetic_multiply');
    // expr_arithmetic_multiply : expr3 ((MUL | DIV) expr3)*

    const MYSELF = 'expr_arithmetic_multiply';
    let left = this.nextExprMethodOf(MYSELF);

    while (this.currentToken.is(MULTIPLY, INTEGER_DIVISION, FLOAT_DIVISION)) {
      let operator = this.operator(MULTIPLY, INTEGER_DIVISION, FLOAT_DIVISION);
      let right = this.nextExprMethodOf(MYSELF);

      left = new BinOp(left, operator, right);
    }

    return left;
  }

  expr_factor() {
    log('expr_factor');
    // factor : (PLUS | MINUS) FACTOR
    //        | INTEGER_CONST
    //        | REAL_CONST
    //        | OPENBRACE EXPR CLOSEBRACE
    //        | procedure_invocation
    //        | Variable
    //        | String

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

    // str
    if (this.currentToken.is(STRING_LITERAL)) {
      this.eat(STRING_LITERAL);
      return new Str(token);
    }

    // INTEGER
    if (this.currentToken.is(INTEGER_CONST, REAL_CONST)) {
      this.eat(INTEGER_CONST, REAL_CONST);
      return new Num(token);
    }

    // id()
    if (this.currentToken.is(ID) && this.nextToken().is(OPENBRACE)) {
      return this.procedure_invocation();
    }

    // var
    if (this.currentToken.is(ID)) {
      return this.variable();
    }

    this.fail('Expected expression');
  }

  procedure_invocation() {
    // procedure_invocation: ID OPENBRACE args_list CLOSEBRACE
    log('procedure_invocation');

    const procedureName = this.currentToken;
    const args = [];

    this.eat(ID);
    this.eat(OPENBRACE);

    // (arg (comma arg)*)
    if (!this.currentToken.is(CLOSEBRACE)) { // there's at least one param
      args.push(this.expr()); // first arg

      while (this.currentToken.is(COMMA)) { // then read pairs (COMMA ARG)
        this.eat(COMMA);
        args.push(this.expr());
      }
    }

    this.eat(CLOSEBRACE);

    return new ProcedureInvokation(procedureName, args);
  }

  variable() {
    log('variable');
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

    if (this.lexer.getNextToken().is(EOF) === false) {
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
