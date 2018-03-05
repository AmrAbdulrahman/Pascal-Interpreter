export async function visitAssign(node) {
  if (this.stepByStep) await this.wait('assign');

  const varName = node.left.value;
  const value = await this.visit(node.right);

  this.currentScope
    .lookup(varName)
    .setValue(value);

  return Promise.resolve(value);
}
