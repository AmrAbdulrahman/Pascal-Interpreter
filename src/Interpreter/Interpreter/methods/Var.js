export async function visitVar(node) {
  if (this.stepByStep) await this.wait('var');

  const varValue = this.currentScope
    .lookup(node.value)
    .getValue();

  return Promise.resolve(varValue);
}
