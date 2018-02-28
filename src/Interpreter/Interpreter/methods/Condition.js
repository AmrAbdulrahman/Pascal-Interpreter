export function visitCondition(node) {
  return !!this.visit(node.expr);
}
