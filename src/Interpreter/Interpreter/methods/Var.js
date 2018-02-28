export function visitVar(node) {
  return this.currentScope
    .lookup(node.value)
    .getValue();
}
