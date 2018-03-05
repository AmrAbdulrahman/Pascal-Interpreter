import { NodeVisitor } from '../Common/NodeVisitor';
import { Defer } from '../Common/Defer';
import { SemanticAnalyzer } from '../SemanticAnalyzer';
import { Scope } from '../Common/Scope';
import { BuiltinsScope } from '../Common/Scope/BuiltinsScope';
import { CallStack } from './CallStack';
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
  visitRepeat,
  visitWhile,
  visitCondition,
  visitObjectLiteral,
  visitPrint,
  visitDottedMemberAccessNode,
  visitBreak,
  visitContinue,
} from './methods/*';

export class Interpreter {
  constructor(code, {stdin, stdout, stderr, stepByStep}) {
    this.stepByStep = stepByStep;
    this.code = code;
    this.stdin = stdin;
    this.stdout = stdout;
    this.stderr = stderr;
    this.currentScope = new BuiltinsScope();
    this.callStack = new CallStack();
    this.waitingDefer = null;

    this.initMethods();
  }

  async visit(node) {
    const methodName = node.name;

    if (Array.isArray(node)) {
      for (let i in node) {
        await this.visit(node[i]);
      }

      return Promise.resolve();
    }

    if (this[`visit${methodName}`]) {
      return await this[`visit${methodName}`](node);
    }

    throw new Error(`a method visit${methodName} is missing`);
  }

  openNewScope(name) {
    this.currentScope = new Scope(name, this.currentScope);
  }

  closeCurrentScope() {
    this.currentScope = this.currentScope.parent;
  }

  wait(message) {
    if (this.waitingDefer) {
      throw new Error(`Two methods can't wait asyncrounsly`);
    }

    this.waitingDefer = new Defer();

    this.stdout.write('>', message);
    this.stdout.write('> hit (c) to continue\n');

    this.stdin.on('input', data => {
      this.waitingDefer.resolve();
      this.waitingDefer = null;
    });

    return this.waitingDefer.promise;
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
      visitRepeat,
      visitWhile,
      visitCondition,
      visitObjectLiteral,
      visitPrint,
      visitDottedMemberAccessNode,
      visitBreak,
      visitContinue,
    };

    // bind methods
    for (let method in this.methods) {
      this[method] = async(...args) => await this.methods[method].call(this, ...args);
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

  async interpret() {
    try {
      const ast = this.validate({delegateEx: true});

      this.stdout.write('Executing code...');
      this.stdout.write('');

      const returnValue = await this.visit(ast);

      if (returnValue !== undefined) {
        this.stdout.write('Program returns:', returnValue);
      }

      return Promise.resolve(returnValue);
    } catch (ex) {
      //console.log(ex);
      this.stderr.write(ex);
    }
  }
}
