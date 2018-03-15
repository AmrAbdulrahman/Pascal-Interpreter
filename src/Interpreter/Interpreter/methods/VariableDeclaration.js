import { VarSymbol } from '../../Common/Symbols/*';

export async function visitVariableDeclaration(node) {
  const varName = node.variable.value;

  if (this.stepByStep) {
    await this.step({
      message: `declaring '${varName}' in '${this.currentScope}' scope`,
      node,
    });
  };

  const varSymbol = new VarSymbol(varName, null);

  this.currentScope.insert(varSymbol);

  return Promise.resolve();
}
