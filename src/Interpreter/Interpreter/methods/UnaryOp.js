import { PLUS } from '../../Common/constants';

export async function visitUnaryOp(node) {
  if (this.stepByStep) {
    await this.step({
      message: 'unary op',
      node,
    });
  }

  const exprValue = await this.visit(node.expr);
  const returnValue = (node.op.type === PLUS ? 1 : -1) * exprValue;

  return Promise.resolve(returnValue);
}
