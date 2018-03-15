import { Return } from '../branching/Return';
import { Break } from '../branching/Break';
import { Continue } from '../branching/Continue';
import { PRINT } from '../../Common/constants';

export async function visitFunctionInvocation(node) {
  if (this.stepByStep) {
    await this.step({
      message: `function invocation ${node}`,
      node,
    });
  }

  const functionName = node.id.value;
  const functionSymbol = this.currentScope.lookup(functionName);

  if (functionName === PRINT) {
    return await this.visitPrint(node);
  }

  const functionScope = functionSymbol.getScope();

  // 1) save locally declared variables state
  const functionVarSymbols = functionScope.getOwnVarSymbols();
  this.callStack.push(functionVarSymbols);

  // 2) evaluate function args before switching scopes
  const evaluatedArgs = [];

  for (let i in node.args) {
    evaluatedArgs.push(await this.visit(node.args[i]))
  }

  // 3) set current scope to function scope
  const initialCurrentScope = this.currentScope;
  this.currentScope = functionScope;

  // 4) evaluate and set function args
  functionSymbol.params.forEach((param, index) => {
    const paramName = param.name;
    const argSymbol = functionScope.lookup(paramName);
    const argValue = evaluatedArgs[index];

    argSymbol.setValue(argValue);
  });

  // 5) execute function body
  const returnValue = await this.visit(functionSymbol.block);

  if (this.stepByStep && returnValue instanceof Return) {
    await this.step({
      message: `function invocation ${node} = ${returnValue.value}`,
      node,
    });
  }

  // 6) restore local variables state
  this.callStack.pull();

  // 7) set back currentScope
  this.currentScope = initialCurrentScope;

  if (returnValue instanceof Break ||
      returnValue instanceof Continue) {
    throw new Error('Invalid break/continue statement');
  }

  const res = returnValue instanceof Return ? returnValue.value : returnValue;
  return Promise.resolve(res);
}
