import { failPositionCodePreview } from '../Utils/*';
import { Lexer } from '../Lexer';
import { EOF } from '../Common/constants';

import {
  eatProgram,
  eatBlock,
  eatScopedBlock,
  eatVariablesDeclaration,
  eatParamsList,
  eatVariablesList,
  eatVariableDeclarationAndAssignment,
  eatFunctionDeclaration,
  eatStatementList,
  eatStatement,
  eatIfBlock,
  eatRepeatBlock,
  eatWhileBlock,
  eatStatementOrScopedBlock,
  eatCondition,
  eatReturnStatement,
  eatBreak,
  eatContinue,
  eatAssignmentStatement,
  eatExpr,
  eatExprLogicalAndOr,
  eatExprLogicalEquals,
  eatExprLogicalLessOrGeaterThan,
  eatExprArithmeticPlusOrMinus,
  eatExprArithmeticMultiply,
  eatExprFactor,
  eatExprChain,
  eatExprNameof,
  eatExprDottedChain,
  eatObjectLiteral,
  eatFunctionInvocation,
  eatVariable,
  eatEmpty,
  eatOperator,
} from './methods/*';

export class Parser {
  constructor(code) {
    this.TOKENS_PEEK_COUNT = 3;
    this.lexer = new Lexer(code);

    this.initTokens();
    this.initMethods();
  }

  initTokens() {
    this.tokens = [];
    this.currentToken = this.lexer.getNextToken();

    for (let i = 0; i < this.TOKENS_PEEK_COUNT; i++) {
      this.tokens.push(this.lexer.getNextToken());
    }
  }

  fail(err) {
    const row = this.currentToken.rowIndex;
    const col = this.currentToken.colIndex;
    const codePreview = failPositionCodePreview(row, col, this.lexer.text);

    throw new Error(`${codePreview}Invalid syntax: ` + (err || 'unexpected token'));
  }

  eat(...types) {
    if (types.indexOf(this.currentToken.type) !== -1) {
      this.currentToken = this.tokens.shift();
      this.tokens.push(this.lexer.getNextToken());
    } else {
      this.fail(`Expected ${types.join('|')} but found ${this.currentToken.type}`);
    }
  }

  eatOptional(...types) {
    if (this.currentToken.is(...types)) {
      this.eat(...types);
    }
  }

  nextToken(n = 1) {
    if (n < 1 || n > this.tokens.length) {
      throw new Error(`Parser: next token number range [1, ${this.tokens.length}]`);
    }

    return this.tokens[n - 1];
  }

  initMethods() {
    this.methods = {
      // program : statement_list
      eatProgram,

      // this is just a block, it does't open a new scope
      // it's useful as `function`, `while`, or `for` body
      eatBlock,

      // scoped_block : OPEN_CURLY_BRACE block CLOSE_CURLY_BRACE
      eatScopedBlock,

      // variable_declaration : CREATE variables_list
      eatVariablesDeclaration,

      // variables_list: variable (COMMA variable)*
      eatParamsList,

      // variables_list: variable_declaration (COMMA variable_declaration)*
      eatVariablesList,

      // variable_declaration_and_possible_assignment : ID (= expr)?
      eatVariableDeclarationAndAssignment,

      // function_declaration : FUNCTION ID (TAKES params_list)? block
      eatFunctionDeclaration,

      // statement_list : statement*
      eatStatementList,

      // statement : assignment_statement
      //           | function_invocation
      //           | return_statement
      //           | if_block
      //           | var_declaration
      //           | function_declaration
      //           | empty
      eatStatement,

      // if_block: IF OPENBRACE condition CLOSEBRACE statement_or_block (ELSE IF condition statement_or_block)* (OTHERWISE statement_or_block)?
      eatIfBlock,

      // repeat_block: REPEAT ID|INTEGER_CONST TIMES statement_or_block
      eatRepeatBlock,

      // while_block: WHILE condition (REPEAT|DO)? statement_or_block
      eatWhileBlock,

      // statement_or_block : (statement SEMI?) | scoped_block
      eatStatementOrScopedBlock,

      // condition: expr
      eatCondition,

      // return_statement : RETURN expr
      eatReturnStatement,

      // break: break
      eatBreak,

      // continue: continue
      eatContinue,

      // assignment_statement : variable ASSIGN expr
      eatAssignmentStatement,

      eatExpr,

      // expr_logical_and_or: something ((AND | OR) something)*
      eatExprLogicalAndOr,

      // expr_logical_equals : ex (NOT? EQUALS expr1)*
      eatExprLogicalEquals,

      // expr_logical_less_or_geater_than: something ((LESS_THAN | GREETER_THAN | LESS_THAN_OR_EQUAL | GREATER_THAN_OR_EQUAL) something)*
      eatExprLogicalLessOrGeaterThan,

      // expr_arithmetic_plus : something ((PLUS | MINUS) something)*
      eatExprArithmeticPlusOrMinus,

      // expr_arithmetic_multiply : something ((MUL | DIV) something)*
      eatExprArithmeticMultiply,

      // factor : (PLUS | MINUS) FACTOR
      //        | INTEGER_CONST
      //        | REAL_CONST
      //        | OPENBRACE EXPR CLOSEBRACE
      //        | function_invocation
      //        | Variable
      //        | String
      //        | Object_Literal
      eatExprFactor,

      // expr_chain: ID (of ID)*
      eatExprChain,

      // expr_dotted_chain: ID (DOT ID)*
      eatExprDottedChain,

      // nameof: NAMEOF? EXPRESSION
      eatExprNameof,

      // object_literal: OPEN_CURLY_BRACE (ID COLON|ASSIGN expr COMMA)* CLOSE_CURLY_BRACE
      eatObjectLiteral,


      // function_invocation: ID OPENBRACE args_list CLOSEBRACE
      eatFunctionInvocation,

      // variable: ID
      eatVariable,

      // empty: NoOp
      eatEmpty,

      // a wrapper that eats and returns current operator token
      eatOperator,
    };

    // bind methods
    for (let method in this.methods) {
      this[method] = (...args) => this.methods[method].call(this, ...args);
    }
  }

  // this method is to decouple the dependency between
  // different expr parts.
  // each mexpr method calls this method to know its following
  // according to the precedence table
  eatHigherPrecedenceExprOf(name) {
    const exprPrecedence = [
      'eatExpr',
      'eatExprLogicalAndOr',
      'eatExprLogicalEquals',
      'eatExprLogicalLessOrGeaterThan',
      'eatExprArithmeticPlusOrMinus',
      'eatExprArithmeticMultiply',
      'eatExprChain', // of
      'eatExprDottedChain',
      'eatExprNameof',
      'eatExprFactor',
    ];

    const currentMethodIndex = exprPrecedence.indexOf(name);

    if (currentMethodIndex === -1) {
      throw new Error(`Internal: can't find a method with name '${name}'`);
    }

    if (currentMethodIndex === exprPrecedence.length - 1) {
      throw new Error(`Internal: method '${name}' has no any higher term, it must resolve something`);
    }

    const nextExprMethodName = exprPrecedence[currentMethodIndex + 1];

    return this[nextExprMethodName]();
  }

  parse() {
    const ast = this.eatProgram();

    if (this.lexer.getNextToken().is(EOF) === false) {
      this.fail();
    }

    return ast;
  }
}
