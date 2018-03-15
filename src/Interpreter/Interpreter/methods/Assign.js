export async function visitAssign(node) {
  const varName = node.left.value;

  if (this.stepByStep) {
    await this.step({
      message: `assigning '${node.right}' to '${varName}'`,
      node,
    });
  }

  const value = await this.visit(node.right);

  this.currentScope
    .lookup(varName)
    .setValue(value);

  return Promise.resolve(value);
}
