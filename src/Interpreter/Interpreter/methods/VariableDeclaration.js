import { VarSymbol } from '../../Symbols/*';

export function visitVariableDeclaration(node) {
  const varName = node.variable.value;
  const varSymbol = new VarSymbol(varName, null);

  this.currentScope.insert(varSymbol);
}
