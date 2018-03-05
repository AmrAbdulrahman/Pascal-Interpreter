import { VarSymbol } from '../../Common/Symbols/*';

export async function visitVariableDeclaration(node) {
  if (this.stepByStep) await this.wait('variable declaration');

  const varName = node.variable.value;
  const varSymbol = new VarSymbol(varName, null);

  this.currentScope.insert(varSymbol);

  return Promise.resolve();
}
