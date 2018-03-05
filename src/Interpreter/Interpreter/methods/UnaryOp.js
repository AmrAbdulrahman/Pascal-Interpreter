export async function visitUnaryOp(node) {
  if (this.stepByStep) await this.wait('unary op');

  const exprValue = await this.visit(node.expr);
  const returnValue = (node.op.type === PLUS ? 1 : -1) * exprValue;

  return Promise.resolve(returnValue);
}
