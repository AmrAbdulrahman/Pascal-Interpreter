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
  constructor(code) {
    this.code = code;
    this.currentScope = new BuiltinsScope();
    this.callStack = new CallStack();
    this.listeners = {};

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

  get on() {
    return {
      error: listener => this.register('error', listener),
      output: listener => this.register('output', listener),
    };
  }

  register(event, listener) {
    this.listeners[event] = this.listeners[event] || [];
    this.listeners[event].push(listener);
  }

  notify(event, ...args) {
    if (!this.listeners[event]) {
      return false; // event has not listeners, lonely!
    }

    this.listeners[event].forEach(listener => listener(...args));
    return true;
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

  output(...args) {
    this.notify('output', args.join(' '));
  }

  error(err) {
    if (err.stack) {
      console.log(err.stack);
      return this.notify('error', err.stack);
    }

    return this.notify('error', err);
  }

  // run semantic analysis
  validate({delegateEx} = {delegateEx: false}) {
    try {
      this.output('Parsing...');
      const ast = (new Parser(this.code)).parse();
      this.output('Parsing: Ok');

      this.output('Running semantic checks...');
      (new SemanticAnalyzer()).visit(ast);
      this.output('Semantic checks: Ok');

      return ast;
    } catch(ex) {
      if (delegateEx) throw ex;
      this.error('Code validation fails');
      this.error(ex);
    }
  }

  async interpret() {
    try {
      const ast = this.validate({delegateEx: true});

      this.output('Executing code...');

      const returnValue = await this.visit(ast);

      if (returnValue !== undefined) {
        this.output('Program returns:', returnValue);
      }

      return Promise.resolve(returnValue);
    } catch (ex) {
      // only throw if there isn't any listener
      // we need some attention here, a hug maybe.
      if (!this.error(ex)) {
        throw ex; // shout then...
      }
    }
  }
}
