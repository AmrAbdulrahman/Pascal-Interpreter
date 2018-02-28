import { NodeVisitor } from '../Common/NodeVisitor';
import { SemanticAnalyzer } from '../SemanticAnalyzer';
import { Scope } from '../Scope';
import { BuiltinsScope } from '../Scope/BuiltinsScope';
import { CallStack } from '../CallStack';
import { Parser } from '../Parser';

import {
  visitProgram,
  visitScopedBlock,
  visitBlock,
  visitVariableDeclaration,
  visitAssign,
  visitNoOp,
  visitVar,
  visitBinOp,
  visitMemberAccessNode,
  visitNum,
  visitStr,
  visitUnaryOp,
  visitReturn,
  visitFunctionDecl,
  visitFunctionLocalDeclarations,
  visitFunctionInvocation,
  visitIf,
  visitCondition,
  visitObjectLiteral,
  visitPrint,
  visitDottedMemberAccessNode,
} from './methods/*';

export class Interpreter extends NodeVisitor {
  constructor(code, {stdin, stdout, stderr}) {
    super();

    this.code = code;
    this.stdin = stdin;
    this.stdout = stdout;
    this.stderr = stderr;
    this.currentScope = new BuiltinsScope();
    this.callStack = new CallStack();

    this.initMethods();
  }

  openNewScope(name) {
    this.currentScope = new Scope(name, this.currentScope);
  }

  closeCurrentScope() {
    this.currentScope = this.currentScope.parent;
  }

  initMethods() {
    this.methods = {
      visitProgram,
      visitScopedBlock,
      visitBlock,
      visitVariableDeclaration,
      visitAssign,
      visitNoOp,
      visitVar,
      visitBinOp,
      visitMemberAccessNode,
      visitNum,
      visitStr,
      visitUnaryOp,
      visitReturn,
      visitFunctionDecl,
      visitFunctionLocalDeclarations,
      visitFunctionInvocation,
      visitIf,
      visitCondition,
      visitObjectLiteral,
      visitPrint,
      visitDottedMemberAccessNode,
    };

    // bind methods
    for (let method in this.methods) {
      this[method] = (...args) => this.methods[method].call(this, ...args);
    }
  }

  // run semantic analysis
  validate({delegateEx} = {delegateEx: false}) {
    try {
      this.stdout.write('Parsing...');
      const ast = (new Parser(this.code)).parse();
      this.stdout.write('Parsing: Ok');

      this.stdout.write('Running semantic checks...');
      (new SemanticAnalyzer()).visit(ast);
      this.stdout.write('Semantic checks: Ok');

      return ast;
    } catch(ex) {
      if (delegateEx) throw ex;
      this.stderr.write('Code validation fails');
      this.stderr.write(ex);
    }
  }

  interpret() {
    try {
      const ast = this.validate({delegateEx: true});

      this.stdout.write('Executing code...');
      this.stdout.write('');

      const returnValue = this.visit(ast);

      if (returnValue !== undefined) {
        this.stdout.write(returnValue);
      }

      return returnValue;
    } catch (ex) {
      //console.log(ex);
      this.stderr.write(ex);
    }
  }
}
