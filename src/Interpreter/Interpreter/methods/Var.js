export async function visitVar(node) {
  const varValue = this.currentScope
    .lookup(node.value)
    .getValue();

  if (this.stepByStep) {
    await this.step({
      message: `retrieving value of '${node.value}' from scope '${this.currentScope}' = ${varValue}`,
      node,
    });
  }

  return Promise.resolve(varValue);
}
