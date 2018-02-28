export function visitAssign(node) {
  const varName = node.left.value;
  const value = this.visit(node.right);

  this.currentScope
    .lookup(varName)
    .setValue(value);

  return value;
}
