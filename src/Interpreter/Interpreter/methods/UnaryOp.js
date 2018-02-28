export function visitUnaryOp(node) {
  return (node.op.type === PLUS ? 1 : -1) * this.visit(node.expr);
}
