import { Return } from '../Return';
import { PRINT } from '../../constants';

export function visitFunctionInvocation(node) {
  const functionName = node.id.value;
  const functionSymbol = this.currentScope.lookup(functionName);

  if (functionName === PRINT) {
    return this.visitPrint(node);
  }

  const functionScope = functionSymbol.getScope();

  // 1) save locally declared variables state
  const functionVarSymbols = functionScope.getOwnVarSymbols();
  this.callStack.push(functionVarSymbols);

  // 2) evaluate function args before switching scopes
  const evaluatedArgs = node.args.map(arg => this.visit(arg));

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
  const returnValue = this.visit(functionSymbol.block);

  // 6) restore local variables state
  this.callStack.pull();

  // 7) set back currentScope
  this.currentScope = initialCurrentScope;

  return returnValue instanceof Return ? returnValue.value : returnValue;
}
